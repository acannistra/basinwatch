import boto3
import decimal
import json
import ulmo

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

def retrieveAnomaly(site, table):
    print('DB')
    db = boto3.resource('dynamodb')
    t = db.Table(table)
    i = t.get_item(Key = {'site' : str(site)})
    print(i)
    try:
        return json.loads(json.dumps({site:i['Item']}, cls=DecimalEncoder))
    except Exception as e:
        return {site: None}
