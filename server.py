from hormoneModel_2_25_13 import hormoneModel
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def data():

    GIn = float(request.args.get('GIn', 0.1))
    XminIn = float(request.args.get('XminIn', 1))
    delSmaxIn = float(request.args.get('delSmaxIn', 1))
    delCmaxIn = float(request.args.get('delCmaxIn', 1))
    tauIn = float(request.args.get('tauIn', 5))
    KIn = float(request.args.get('KIn', 1))
    alphaIn = float(request.args.get('alphaIn', 2))
    betaIn = float(request.args.get('betaIn', 2))
    muIn = float(request.args.get('muIn', 0.0001))
    NIn = int(request.args.get('NIn', 100))
    foodShort = float(request.args.get('foodShort', 0.5))
    foodShortbegin = int(request.args.get('foodShortbegin', 8))
    foodShortend = int(request.args.get('foodShortend', 20))

    data = hormoneModel(GIn=GIn, XminIn=XminIn, delSmaxIn=delSmaxIn, delCmaxIn=delCmaxIn, tauIn=tauIn, KIn=KIn, alphaIn=alphaIn, betaIn=betaIn, muIn=muIn, NIn=NIn, foodShort=foodShort, foodShortbegin=foodShortbegin, foodShortend=foodShortend)
    return jsonify(data)

@app.route('/test', methods=['GET'])
def test():
    return jsonify('boo:')

if __name__ == '__main__':
    app.run(port=5000)
