from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.dialects.postgresql import JSON
import os


app = Flask(__name__,static_url_path='/static')
app.config['SQLALCHEMY_DATABASE_URI']= os.environ['DATABASE_URL']
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = 'some_secret'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)



class training(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    created_on=db.Column(db.TIMESTAMP,server_default=db.func.current_timestamp())
    file_name = db.Column(db.String(255),nullable=False)
    file_type = db.Column(db.String(255),nullable=False)
    file_URL = db.Column(db.String(255))
    real_height = db.Column(db.Integer)
    real_width = db.Column(db.Integer)
    thickness_points=db.Column(JSON)
    background_data=db.Column(JSON)

    def __init__(self, file_name,file_URL,file_type,real_height,real_width,background_data,thickness_points):

        self.file_name=file_name
        self.file_URL=file_URL
        self.file_type=file_type
        self.real_height=real_height
        self.real_width=real_width
        self.background_data=background_data
        self.thickness_points=thickness_points


    def add(self,data):
        db.session.add(data)
        return session_commit()

def  session_commit():
    try:
        return(db.session.commit())
    except SQLAlchemyError as e:
        return(str(e))

with app.app_context():
    db.create_all()
