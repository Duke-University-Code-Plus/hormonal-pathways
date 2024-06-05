import json
from hormoneModel_6_4_24 import hormoneModel
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

@app.route('/hormonemodel', methods=['GET'])
def get_arrays():
    results = hormoneModel(gammaIn= request.args.get('gammaIn'), 
                 GIn = request.args.get('GIn'), XminIn= request.args.get('XminIN'), delSmaxIn= request.args.get('delSmaxIn'), 
                 delCmaxIn = request.args.get('delCmaxIN'), tauIn = request.args.get('tauIn'), KIn = request.args.get('KIn'), 
                 alphaIn = request.args.get('alphaIn'), betaIn= request.args.get('betaIn'), muIn= request.args.get('muIn'), 
                 zIn = request.args.get('zIn'), NIn = request.args.get('NIn'), foodShort = request.args.get('foodShort'), 
                 foodShortbegin = request.args.get('foodShortbegin'), foodShortend =request.args.get('foodShortend'))
    return jsonify(results)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
   app.run(port=5000)

