"""
将json文件转换为方便浏览的ANKI格式题库文件, 分隔符为tab, options之间用"||"分割, 答案用数字表示位置(从1开始)
"""
import json
import hashlib

src_path = "题库_排序版.json"
dst_path = "题库_排序版_ANKI.txt"

with open(src_path, "r", encoding="utf8") as f:
    data = json.loads(f.read())

with open(dst_path, "w", encoding="utf-8") as f:
    f.write("#guid column:1\n")
    for idx, i in enumerate(data, 1):
        # 使用md5的前8位生成guid, 保证编号的唯一性
        guid = "xxqgtzdt" + hashlib.md5(i.encode('utf-8')).hexdigest()[:8]
        print(guid, i)
        question = (i.split("|")[0]).replace("        ", "____")
        options = "||".join(i.split("|")[1:])
        answer = data[i]
        answer_index = i.split("|")[1:].index(answer) + 1
        f.write(f"{guid}\t{idx}\t{question}\t{options}\t{answer_index}\n")
        