from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource

from models import db, Message

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)

class Messages(Resource):
    def get(self):
        response_dict = [m.to_dict() for m in Message.query.all()]
        
        response = make_response(
            jsonify(response_dict), 200,
        )
        return response
    
    def post(self):
        data = request.get_json()
        new_message = Message(
            body=data.get('body'),
            username=data.get('username'),
        )
        db.session.add(new_message)
        db.session.commit()
        response_dict = new_message.to_dict()
        response = make_response(
            jsonify(response_dict),
            201,
        )
        return response
        
        
api.add_resource(Messages, '/messages')

class MessagesID(Resource):
    
    def patch(self, id):
        data = request.get_json()
        m = Message.query.filter_by(id=id).first()
        if m:
            print(f"Before update: {m}")
            m.body = data["body"]
            print(f"after update{m}")
                
            db.session.add(m)
            db.session.commit()
            
            m_dict = m.to_dict()
            response = make_response(
                jsonify(m_dict),
                200,
            )
            return response
        else:
            response = make_response(
                jsonify({"error": "Message not found"}),
                404,
            )
            return response
    
    def delete(self, id):
        m = Message.query.filter_by(id=id).first()
        if m:
            db.session.delete(m)
            db.session.commit()
            
            m_dict = {
                "delete successful": True,
                "message": "Message deleted"
            }
            response = make_response(
                jsonify(m_dict),
                200,
            )
            return response
        else:
            response = make_response(
                jsonify({"error": "Message not found"}),
                404,
            )
        return response            
    
api.add_resource(MessagesID, '/messages/<int:id>')    


if __name__ == '__main__':
    app.run(port=5555)
