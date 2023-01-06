# 转换为数据库的简单示例

import sqlite3
import json

tk_database_path = "xxqg_tiku.db"
tk_json_path = "题库_排序版.json"

connect = sqlite3.connect(tk_database_path)  # 连接数据库，没有就创建
cursor = connect.cursor()  # 获取游标

# 读取json文件
with open(tk_json_path, "r", encoding="utf8") as f:
    tk_json = json.loads(f.read())

# 创建表单并添加数据
cursor.execute(f'''CREATE TABLE IF NOT EXISTS TZDT
                (question TEXT PRIMARY KEY NOT NULL,
                answer TEXT NOT NULL);''')
for question, answer in tk_json.items():
    cursor.execute(f'''insert or ignore into TZDT (question,answer) values (?,?)''', (question,answer))

# 查询表单全部数据并输出
for question, answer in cursor.execute('select * from TZDT').fetchall():
    print(question, answer)

cursor.close()  # 关闭游标
connect.commit()  # 提交更改
connect.close()  # 关闭数据库连接
