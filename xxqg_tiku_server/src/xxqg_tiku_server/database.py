import sqlite3

class SQLDataBase:
    def __init__(self, database):
        self.database = database
        self.create_database(database=database)
        self.conn = sqlite3.connect(database, check_same_thread=False)
        
    def create_database(self, database):
        conn = sqlite3.connect(database)
        cur = conn.cursor()
        # TZDT - 挑战答题
        try:
            cur.execute(f'''CREATE TABLE IF NOT EXISTS TZDT
                (question TEXT PRIMARY KEY NOT NULL,
                answer TEXT NOT NULL);''')
        except:
            print("创建失败")
        conn.commit()
        conn.close()
        return 

    def insert(self, **kargs):
        if "question" not in kargs:
            raise Exception("无question")
        question = kargs["question"]
        cur = self.conn.cursor()
        cursor = cur.execute(f'SELECT * from TZDT where question="{question}"')
        if cursor.fetchone() is not None:
            return False
        names = ",".join(list(kargs.keys()))
        values = ",".join([f"'{i}'" for i in kargs.values()])
        cur.execute(f"INSERT INTO TZDT ({names}) VALUES ({values})")
        self.conn.commit()
        return True

    def get(self, key, default_value=None):
        cur = self.conn.cursor()
        cursor = cur.execute(f"SELECT answer from TZDT where question='{key}'")
        value = cursor.fetchone()
        return value[0] if value is not None else default_value

    def get_all(self):
        cur = self.conn.cursor()
        cursor = cur.execute(f"SELECT * from TZDT")
        value = cursor.fetchall()
        return {i[0]:i[1] for i in value}

    def __del__(self):
        self.conn.close()
