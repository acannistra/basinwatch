import pandas as pd
from AnomalyDetector import AnomalyDetector
from datetime import datetime

g = pd.read_csv('../data/gageids.csv', header=None, dtype='str')

ad = AnomalyDetector('streamanomaly', datetime.now())
ad.getAnomalies(g[0].values)
