from datetime import datetime
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

class TodoListView(APIView):

    def get(self, request):
        
        try:
            todos = list(db.todos.find())
            for todo in todos:
                todo['_id'] = str(todo['_id'])
            
            return Response(todos, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error fetching todos: {str(e)}")
            return Response(
                {"error": "Failed to fetch todos"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def post(self, request):
        try:
            todo_description = request.data.get('todo_description', '').strip()
            
            if not todo_description:
                return Response(
                    {"error": "Todo text is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            new_todo = {
                "text": todo_description,
                "completed": False,
                "created_at": datetime.now() 
            }
            
            res = db.todos.insert_one(new_todo)
            created_todo = {
                '_id': str(res.inserted_id),
                'text': todo_description,
                'completed': False
            }
            
            return Response(created_todo, status=status.HTTP_201_CREATED)
        except Exception as e:
            logging.error(f"Error creating todo: {str(e)}")
            return Response(
                {"error": "Failed to create todo"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )