# Docker Setup Issues and Solutions

## Issues Encountered

### 1. **MongoDB Installation Failure**

**Problem:** MongoDB wouldn't install properly in the container.

**Root Cause:**

- We used `FROM python:3.8` which defaults to Debian Bullseye (11.x)
- MongoDB 4.4 only officially supports Debian Buster (10.x)
- The MongoDB APT repository wasn't compatible with Bullseye

**What Happened:**
The container build would fail with errors like "package not found" or "repository not available" because MongoDB's packages weren't available for the newer Debian version.

**Solution:**
Changed to `FROM python:3.8-buster` in Dockerfile to explicitly use Debian Buster, which is compatible with MongoDB 4.4.

---

### 2. **Django Can't Connect to MongoDB**

**Problem:** Django application couldn't talk to MongoDB even though both were running.

**Root Cause:** Timing issue - Django started before MongoDB was ready to accept connections.

**What Happened:**

- MongoDB takes a few seconds to initialize and start
- Django would start immediately and try to connect
- Connection would fail because MongoDB wasn't listening yet
- Django would crash or show database errors

**Solution:**
Added a 5-second delay before starting Django:

```bash
bash -c "sleep 5 && cd /src/rest && python manage.py runserver 0.0.0.0:8000"
```

---

### 3. **Permission Denied for MongoDB Files**

**Problem:** MongoDB kept crashing with "Permission denied" errors when trying to write data.

**Root Cause:** Filesystem permission conflict between Windows host and Linux container.

**The Technical Reason:**

- MongoDB runs as user ID 999 inside the Linux container
- We mounted a Windows folder (`C:\Users\...\db\`) to `/data/db` in the container
- Windows NTFS doesn't understand Linux user IDs (like 999)
- When MongoDB tried to create/write files, Windows said "No permission!"

**Visual Example:**

```
Container (Linux)          Host (Windows)
-----------                --------------
MongoDB (UID 999)  --->  C:\project\db\
     ↓                         ↓
"Create file"           "Who is user 999?"
     ↓                         ↓
Permission denied!      "I don't know this user!"
```

**What Happened:**
MongoDB logs showed errors like:

```
file-rename: rename: Permission denied
file-remove: unlink: Permission denied
```

**Solution:**
Instead of mounting a Windows folder, we used Docker's **named volume**:

```yaml
volumes:
  - mongo-data:/data/db # Docker-managed storage
```

Named volumes live inside Docker's own filesystem where it can properly manage Linux permissions.

---

### 4. **Package Compatibility Issues**

**Problem:** Some Python packages had version conflicts.

**Specific Issue:** `celery` and `click-repl` packages wanted different versions of dependencies.

**What Happened:**
During `pip install`, we'd get errors like:

```
Cannot uninstall 'click'. It is a distutils installed project...
```

**Solution:**
Updated `requirements.txt` to use compatible versions, specifically ensuring `click-repl>=0.2.0`.
