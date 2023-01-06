import sqlite3
import json

tk_database_path = "xxqg_tiku.db"
tk_json_path = "题库_排序版.json"

connect = sqlite3.connect(tk_database_path)  # 连接数据库，没有就创建
cursor = connect.cursor()  # 获取游标

# 查询表单全部数据并输出
tk_json = {}
for question, answer in cursor.execute('select * from TZDT').fetchall():
    tk_json[question] = answer

# 写入json文件
with open(tk_json_path, "w", encoding='utf-8') as f:
    f.write(json.dumps(tk_json, ensure_ascii=False))