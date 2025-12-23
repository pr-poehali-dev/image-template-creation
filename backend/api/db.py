import os
import psycopg2
from psycopg2.extras import RealDictCursor

_db_connection = None

def get_db_connection():
    global _db_connection
    if _db_connection is None or _db_connection.closed:
        _db_connection = psycopg2.connect(os.environ['DATABASE_URL'])
    return _db_connection

def serialize_dates(obj):
    if obj is None:
        return None
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    return obj

def dict_to_json(data):
    if isinstance(data, dict):
        return {k: serialize_dates(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [dict_to_json(item) for item in data]
    return serialize_dates(data)
