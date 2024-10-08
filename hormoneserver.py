import json
import numpy as np
import llava
from hormoneModel_6_4_24 import hormoneModel
from hormoneMulti import runMultiRun
from hormoneModelStat import hormoneModelStatRun
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def parse_array_param(param):
    return np.array([float(x) for x in param.split(',')]) if param else np.array([])

@app.route('/hormonemodel', methods=['GET'])
def get_arrays():
    try:
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
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/multihormonemodel', methods=['GET'])
def get_multi_arrays():
    try:
        gamma = parse_array_param(request.args.get('gamma'))
        z = parse_array_param(request.args.get('z'))

        results = runMultiRun(
            gammaIn=gamma, 
            GIn=float(request.args.get('G', 0.1)), 
            XminIn=float(request.args.get('Xmin', 1)), 
            delSmaxIn=float(request.args.get('delSmax', 1)), 
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
            foodShortend=int(request.args.get('foodShortend', 0)),
            variableName=request.args.get('variableName', ''),
            variableRangeBegin=float(request.args.get('variableRangeBegin', 0)),
            variableRangeEnd=float(request.args.get('variableRangeEnd', 0)),
            numRuns=int(request.args.get('numRuns', 0))
        )
        return jsonify(results)
    except Exception as e:
        app.logger.error(f"Error processing request: {e}")
        return jsonify({'error': str(e)}), 400
    
@app.route('/statModel', methods=['GET'])
def get_stat_arrays():
    try:
        gamma = parse_array_param(request.args.get('gamma'))
        z = parse_array_param(request.args.get('z'))

        results = hormoneModelStatRun(
            gammaIn=gamma, 
            GIn=float(request.args.get('G', 0.1)), 
            XminIn=float(request.args.get('Xmin', 1)), 
            delSmaxIn=float(request.args.get('delSmax', 1)), 
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
            foodShortend=int(request.args.get('foodShortend', 0)),
            numRuns=int(request.args.get('numRuns', 0))
        )
        return jsonify(results)
    except Exception as e:
        app.logger.error(f"Error processing request: {e}")
        return jsonify({'error': str(e)}), 400
    
@app.route('/llavaserver', methods=['POST'])
def run_script():
    index = request.json.get('index')
    data = request.json.get('base64')
    response = llava.run_analysis(index, data)
    print(response)
    # Return some result
    return jsonify({"message": response})
    


if __name__ == '__main__':
    app.run(port=5000)



