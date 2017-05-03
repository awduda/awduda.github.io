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

    red_c_gs=db.Column(db.Float)
    green_c_gs=db.Column(db.Float)
    blue_c_gs=db.Column(db.Float)
    color_c=db.Column(db.Float)
    background_type=db.Column(db.String(40))
    num_layers=db.Column(db.Integer)


    def __init__(self, red_c_gs,green_c_gs,blue_c_gs,color_c,background_type,num_layers):


        self.red_c_gs=red_c_gs
        self.green_c_gs=green_c_gs
        self.blue_c_gs=blue_c_gs
        self.color_c=color_c
        self.background_type=background_type
        self.num_layers=num_layers


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
