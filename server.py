from hormoneModel_2_25_13 import hormoneModel
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def data():
    GIn = float(request.args.get('GIn'))
    XminIn = float(request.args.get('XminIn'))
    delSmaxIn = float(request.args.get('delSmaxIn'))
    delCmaxIn = float(request.args.get('delCmaxIn'))

    data = hormoneModel(GIn=GIn, XminIn=XminIn, delSmaxIn=delSmaxIn, delCmaxIn=delCmaxIn)
    return jsonify(data)

@app.route('/test', methods=['GET'])
def test():
    return jsonify('boo:')

if __name__ == '__main__':
    app.run(port=5000)
