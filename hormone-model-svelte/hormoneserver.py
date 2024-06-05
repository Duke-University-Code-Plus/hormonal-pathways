import json
import numpy as np
from hormoneModel_6_4_24 import hormoneModel
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def parse_array_param(param):
    return np.array([float(x) for x in param.split(',')] if param else np.array([]))

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

if __name__ == '__main__':
    app.run(port=5000)



