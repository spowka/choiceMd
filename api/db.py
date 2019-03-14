import psycopg2
from psycopg2.extras import RealDictCursor

pg_connection_string = None

def init_pg(app):
    global pg_connection_string
    pg_connection_string = "dbname='{0}' user='{1}' host='{2}' password='{3}'".format(app.config["POSTGRES_DATABASE_DB"],
                                                                                      app.config["POSTGRES_DATABASE_USER"],
                                                                                      app.config["POSTGRES_DATABASE_HOST"],
                                                                                      app.config["POSTGRES_DATABASE_PASSWORD"])

def pg_select_rows(sql, parameters):    	    
    conn = psycopg2.connect(pg_connection_string)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute(sql, parameters)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def pg_select_rows_with_count(sql, parameters):	    
    rows = pg_select_rows(sql, parameters)
    rows_count = 0

    if len(rows) > 0:
        rows_count = rows[0]["row_count"]

    return rows, rows_count


def pg_execute(sql, parameters):
    conn = psycopg2.connect(pg_connection_string)
    cur = conn.cursor()
    cur.execute(sql, parameters)    

    if cur.description:
        rows = cur.fetchall()
    else:
        rows = None

    conn.commit()
    cur.close()
    conn.close()

    if rows == None or len(rows) == 0:
        return None
    else:
        return rows[0][0]

def pg_execute_all(sql, parameters):
    conn = psycopg2.connect(pg_connection_string)
    cur = conn.cursor()
    psycopg2.extras.execute_values(cur, sql, parameters)    

    if cur.description:
        rows = cur.fetchall()
    else:
        rows = None

    conn.commit()
    cur.close()
    conn.close()

    if rows == None or len(rows) == 0:
        return None
    else:
        return rows[0][0]
