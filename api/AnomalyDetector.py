# Determines current percentage above median for streamflow.
#import boto3
import pandas as pd
from ulmo import usgs
import unittest
import boto3
import decimal

from multiprocessing import Pool
from functools import partial

class TestAnomalyDetector(unittest.TestCase):
    def test_anomaly(self):
        from datetime import datetime
        test_site = '09085000'
        ad = AnomalyDetector('.', datetime.now())
        print(ad._siteAnomaly(test_site))
        self.assertTrue(True)

    def test_some(self):
        from datetime import datetime
        test_sites = ['09403013', '09423000', '09380000']
        ad = AnomalyDetector('.', datetime.now())
        print(ad._reloadAnomalies(test_sites))
        self.assertTrue(True)

def round_float_to_decimal(float_value):
    """
    Convert a floating point value to a decimal that DynamoDB can store,
    and allow rounding.
    """

    # Perform the conversion using a copy of the decimal context that boto3
    # uses. Doing so causes this routine to preserve as much precision as
    # boto3 will allow.
    with decimal.localcontext(boto3.dynamodb.types.DYNAMODB_CONTEXT) as \
         decimalcontext:

        # Allow rounding.
        decimalcontext.traps[decimal.Inexact] = 0
        decimalcontext.traps[decimal.Rounded] = 0
        decimal_value = decimalcontext.create_decimal_from_float(float_value)

        if str(decimal_value) in ['Infinity', 'NaN']:
            return decimalcontext.create_decimal_from_float(-1)

        return decimal_value


NWIS_DAILY_STAT_URL = "https://waterservices.usgs.gov/nwis/stat/?format=rdb&sites={sites}&statReportType=daily&statTypeCd={stat}"

class AnomalyDetector:
    def __init__(self, dbTable, timestamp):
        """
            Calculates current, median at <timestamp> and anomaly at <timestamp> streamflow for usgs sites and stores in
            an Amazon DynamoDB Table.
        """
        self.timestamp = timestamp
        self.dbTable = dbTable

    def __repr__(self):
        return "<AnomalyDetector at {} timestamp: {} dbTable: {}>".format(hex(id(self)), self.timestamp, self.dbTable)

    def _siteAnomaly(self, site, param='00060'):

        dtypes = {
            'month_nu' : 'int',
            'day_nu' : 'int',
            'p50_va' : 'float'
        }


        try:
            hist_stats = pd.read_csv(NWIS_DAILY_STAT_URL.format(sites = site, stat='median'), sep='\t', comment='#').drop(0, axis=0)

            hist_stats = hist_stats.astype(dtypes)

            daily_stats = hist_stats[
                (hist_stats.parameter_cd == param) &
                (hist_stats.month_nu == self.timestamp.month) &
                (hist_stats.day_nu == self.timestamp.day)
            ]

            median = daily_stats.p50_va.values[0]

            current_data = usgs.nwis.get_site_data(site, parameter_code=param, service='iv')

            current_flow = float(current_data['00060:00000']['values'][0]['value'])
            obstime = current_data['00060:00000']['values'][0]['datetime']
        except Exception:
            return {
                'site' : site,
                'median' : -1,
                'current' : -1,
                'anomaly' : -1
            }


        return {
            'site' : site,
            'obstime' : obstime,
            'median' : round_float_to_decimal(median),
            'current' : round_float_to_decimal(current_flow),
            'anomaly' : round_float_to_decimal((current_flow / median) * 100)
        }

    def _loadAnomalies(self, sites):
        mp = Pool()

        res = mp.map(self._siteAnomaly, sites)

        return res
        # return { s : r for s, r in zip(sites, res)}

    def _clearDb(self):
        db = boto3.resource('dynamodb')

        table = db.Table(self.dbTable)
        numItems = table.item_count

        if numItems > 0:
            sites = [i['site'] for i in t.scan()['Items']]
            with table.batch_writer() as bw:
                for s in sites:
                    bw.delete_item(Key = {'site': s})


    def getAnomalies(self, sites):
        db = boto3.resource('dynamodb')
        dbTable = db.Table('streamanomaly')

        anomalies = self._loadAnomalies(sites)

        self._clearDb()

        with dbTable.batch_writer() as batchWrite:
            for s in anomalies:
                batchWrite.put_item(Item = s)
