from flask import Flask, request, jsonify
import base64
import llava
import requests
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/llavaserver', methods=['POST'])
def run_script():
    data = request.json.get('base64')
    response = llava.run_analysis(data)
    print(response)
    # Return some result
    return jsonify({"message": response})

if __name__ == '__main__':
    app.run(port=5200)