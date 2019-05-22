from flask import Flask
from flask import request, jsonify, make_response
from AnomalyRetriever import retrieveAnomaly
from AnomalyDetector import AnomalyDetector
import json
from datetime import datetime

app = Flask(__name__)

ANOMALY_TABLE = 'streamanomaly'

@app.route('/')
def root():
    return "No Parameters Specified."

@app.route('/anomalies')
def anomalies():
    sites = request.args.get('sites')

    if sites is None:
        return make_response("no sites provided", 400)

    try:
        sites = sites.split(',')
    except Exception as e:
        print(e)
        sites = [sites]

    res = []

    for site in sites:
        res.append(retrieveAnomaly(site, ANOMALY_TABLE))


    return (jsonify(res))


@app.route('/refresh', methods=['POST'])
def refresh():
    r = request.json
    if not r:
        abort(400)

    try:
        ts = r['timestamp']
        sites = r['sites']
    except Exception as e:
        return "need timestamp and sites", 400

    print(ts)
    ad = AnomalyDetector('streamanomaly',
                         datetime.utcfromtimestamp(int(ts)/1000.0))

    try:
        ad.getAnomalies(sites)
    except Exception as e:
        return e, 500

    return jsonify({'status': 'OK', 'sites' : sites}), 200



if __name__ == "__main__":
    app.run()
