from flask import Flask,url_for,request
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.dialects.postgresql import JSON
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

            file_name=data['filename']
            file_type=data['filetype']
            file_URL="HI"
            real_width=data['width']
            real_height=data['height']
            background_data=data['background_data']
            thickness_points=data['thickness_data']
            t=training(file_name,file_URL,file_type,real_height,real_width,background_data,thickness_points)
            q=t.add(t)
            return("hi")

        else:
            return("no")
            
 if __name__ == '__main__':
     app.debug = True
     port = int(os.environ.get("PORT", 5000))
     app.run(host='0.0.0.0', port=port)
