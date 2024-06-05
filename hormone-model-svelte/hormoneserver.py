import json
from hormoneModel_6_4_24 import hormoneModel
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

def parse_array_param(param):
    """Convert a comma-separated string into a list of floats."""
    return [float(x) for x in param.split(',')] if param else []

@app.route('/hormonemodel', methods=['GET'])
def get_arrays():
    gamma = parse_array_param(request.args.get('gamma'))
    z = parse_array_param(request.args.get('z'))

    results = hormoneModel(
        gammaIn=gamma, 
        GIn=float(request.args.get('G', 0)), 
        XminIn=float(request.args.get('Xmin', 0)), 
        delSmaxIn=float(request.args.get('delSmax', 0)), 
        delCmaxIn=float(request.args.get('delCmax', 0)), 
        tauIn=float(request.args.get('tau', 0)), 
        KIn=float(request.args.get('K', 0)), 
        alphaIn=float(request.args.get('alpha', 0)), 
        betaIn=float(request.args.get('beta', 0)), 
        muIn=float(request.args.get('mu', 0)), 
        zIn=z, 
        NIn=int(request.args.get('N', 0)), 
        foodShort=float(request.args.get('foodShort', 0)), 
        foodShortbegin=int(request.args.get('foodShortbegin', 0)), 
        foodShortend=int(request.args.get('foodShortend', 0))
    )
    return jsonify(results)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=5000)


