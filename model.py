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

    thickness_data=db.Column(JSON)
    background_data=db.Column(JSON)

    def __init__(self, background_data,thickness_data):


        self.background_data=background_data
        self.thickness_data=thickness_data


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
