from flask import Flask,url_for,request
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.dialects.postgresql import JSON
import os
import json


from model import training,app
@app.route('/')
def main_index():
    return render_template('index.html')

@app.route('/classify/')
def classifier():
    return render_template('classifier.html')


@app.route('/contribute/')
def contribute():
    return render_template('contribute.html')

@app.route('/add_training/' , methods=['POST', 'GET'])
def training_add():
        if request.method == 'POST':
            data=json.loads(request.get_json())


            red_c_gs=data['red_c_gs']
            green_c_gs=data['green_c_gs']
            blue_c_gs=data['blue_c_gs']
            color_c=data['color_c']
            background_type=data['background_type']
            num_layers=data['num_layers']




            t=training(red_c_gs,green_c_gs,blue_c_gs,color_c,background_type,num_layers)
            q=t.add(t)
            return("hi")

        else:
            return("no")

if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
