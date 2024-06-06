from hormoneModel_2_25_13 import hormoneModel
from flask import Flask, jsonify, request
import json

app = Flask(__name__)

@app.route('/', methods=['GET'])
def data():
    # parameters = json.loads(request.data)
    # parse through json and create variables for each parameter
    # input parameters into hormoneModel 
    data = hormoneModel()
    return jsonify(data)

if __name__ == '__main__':
   app.run(port=5000)