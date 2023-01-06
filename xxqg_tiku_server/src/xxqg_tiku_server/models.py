import json, os

class Qustion:
    @staticmethod
    def sort(recept_question):
        str_list = recept_question.split("|")
        q = str_list[0]
        a = sorted(str_list[1:])
        query_question = "|".join([q] + a)
        return query_question

def load_from_json(path):
    if not os.path.exists(path):
        res = {}
    else:
        with open(path, "r", encoding="utf8") as f:
            res = json.loads(f.read())
    return res


def save_to_json(path, content: dict):
    with open(path, "w", encoding='utf-8') as f:
        f.write(json.dumps(content, ensure_ascii=False))


def save_to_md(path, content: dict):
    # 添加markdown字符
    count = 0
    txtlist = []
    for key in content:
        count += 1
        # 分割问题与答案
        a = key.split("|")
        # 添加序号，并将空白符转为下划线
        a[0] = str(count) + ". " + a[0].replace("        ", "____")
        # 可选答案前添加 * 转为无序列表
        for j in range(1, len(a)):
            a[j] = "* " + a[j]
        # 正确答案处理
        a.append("> 正确答案为：`" + content[key] + "`")
        # 所有答案前添加空格以缩进
        for j in range(1, len(a)):
            a[j] = "      " + a[j]
        # 添加换行符
        txtlist.append("  \n".join(a))

    # 保存到.md文件中
    with open(path, 'w', encoding='utf-8') as f:
        f.write("\n\n".join(txtlist))


