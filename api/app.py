from flask import Flask
from flask_cors import CORS
from flask import request, jsonify, make_response
#from AnomalyRetriever import retrieveAnomaly
# from AnomalyDetector import AnomalyDetector
import json
import boto3
import decimal
from datetime import datetime

app = Flask(__name__)
CORS(app)

ANOMALY_TABLE = 'streamanomaly'

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)


@app.route('/')
def root():
    return "No Parameters Specified."

@app.route('/anomalies')
def anomalies():

    db = boto3.resource('dynamodb')
    t = db.Table(ANOMALY_TABLE)
    res = t.scan()

    res = json.loads(json.dumps(res['Items'], cls=DecimalEncoder))

    res = {i['site'] : i for i in res}

    return (jsonify(res))
#
#
# @app.route('/refresh', methods=['POST'])
# def refresh():
#     r = request.json
#     if not r:
#         abort(400)
#
#     try:
#         ts = r['timestamp']
#         sites = r['sites']
#     except Exception as e:
#         return "need timestamp and sites", 400
#
#     print(ts)
#     ad = AnomalyDetector('streamanomaly',
#                          datetime.utcfromtimestamp(int(ts)/1000.0))
#
#     try:
#         ad.getAnomalies(sites)
#     except Exception as e:
#         return e, 500
#
#     return jsonify({'status': 'OK', 'sites' : sites}), 200
#
#

if __name__ == "__main__":
    app.run()
