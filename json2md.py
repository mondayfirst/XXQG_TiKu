"""
将json文件转换为方便浏览的markdown格式题库文件
"""

import ast
import os

# 输入参数设置
scr_file = [file for file in os.listdir() if file.endswith(".json")][-1]
obj_file = os.path.splitext(scr_file)[0] + ".md"

# 读取json文件
with open(scr_file, 'r', encoding='utf-8') as f:
    txt = f.read()
dict = ast.literal_eval(txt)
# # 字典转换为json格式
# import json
# json_str = json.dumps(dict, ensure_ascii=False)

# 添加markdown字符
count = 0
res = []
for i in dict:
    count += 1
    # 分割问题与答案
    a = i.split("|")
    # 添加序号，并将空白符转为下划线
    a[0] = str(count) + ". " + a[0].replace("        ", "____")
    # 可选答案前添加 * 转为无序列表
    for j in range(1, len(a)):
        a[j] = "* " + a[j]
    # 正确答案处理
    a.append("> 正确答案为：`" + dict[i] + "`")
    # 所有答案前添加空格以缩进
    for j in range(1, len(a)):
        a[j] = "      " + a[j]
    # 添加换行符
    res.append("  \n".join(a))

# 保存到.md文件中
with open(obj_file, 'w', encoding='utf-8') as f:
    f.write("\n\n".join(res))
