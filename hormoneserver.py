import json
from hormoneModel_6_4_24 import hormoneModel
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

@app.route('/hormonemodel', methods=['GET'])
def get_arrays():
    return jsonify(hormoneModel())

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
   app.run(port=5000)

