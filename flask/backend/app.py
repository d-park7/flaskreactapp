from gettext import textdomain
from flask import Flask
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class TaskModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(19), nullable=False)
    reminder = db.Column(db.Boolean)

    def __repr__(self):
        return f"Task(text = {text}, date = {date}, reminder = {reminder})"

task_put_args = reqparse.RequestParser()
task_put_args.add_argument("text", type=str, help="Task body is required", required=True)
task_put_args.add_argument("date", type=str, help="Date task due by is required", required=True)
task_put_args.add_argument("reminder", type=bool, help="Set a reminder is required", required=True)

task_update_args = reqparse.RequestParser()
task_update_args.add_argument("text", type=str, help="Task body is required")
task_update_args.add_argument("date", type=str, help="Date task due by is required")
task_update_args.add_argument("reminder", type=bool, help="Set a reminder is required")

resource_fields = {
    'id': fields.Integer,
    'text': fields.String,
    'date': fields.String,
    'reminder': fields.Boolean
}

class Reminders(Resource):
    @marshal_with(resource_fields)
    def get(self):
        result = TaskModel.query.all()
        if not result:
            abort(404, message="No tasks in db")
        return result

class Reminder(Resource):
    @marshal_with(resource_fields)
    def get(self, task_id):
        result = TaskModel.query.filter_by(id=task_id).first()
        if not result:
            abort(404, message="Could not find task with that id")
        return result

    @marshal_with(resource_fields)
    def post(self, task_id):
        args = task_put_args.args()
        result = TaskModel.query.filter_by(id=task_id).first()
        if result:
            abort(404, message="Task id already exists")
        task = TaskModel(id=task_id, text=args['text'], date=args['date'], reminder=['reminder'])
        db.session.add(task)
        db.session.commit()
        return task, 201

    @marshal_with(resource_fields)
    def patch(self, task_id):
        args = task_update_args.parse_args()
        result = TaskModel.query.filter_by(id=task_id).first()
        if not result:
            abort(404, message="Task doesn't exist, cannot update")
        
        if args['text']:
            result.text = args['text']
        if args['date']:
            result.date = args['date']
        if args['reminder']:
            result.reminder = args['reminder']

        db.session.commit()

        return result

    def delete(self, task_id):
        result = TaskModel.query.filter_by(id=task_id).delete()
        db.session.commit()
        return "", 204

api.add_resource(Reminders, "/tasks")
api.add_resource(Reminder, "/tasks/<int:task_id>")

if __name__ == "__app__":
    app.run(debug=True)