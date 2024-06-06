from hormoneModel_2_25_13 import hormoneModel
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def data():
    # parameters = json.loads(request.data)
    # parse through json and create variables for each parameter
    # input parameters into hormoneModel 
    data = hormoneModel()
    return jsonify(data)

@app.route('/test', methods=['GET'])
def test():
    input = request.args.get('input')
    print(input)
    return jsonify('boo:'+input)

if __name__ == '__main__':
    app.run(port=5000)
