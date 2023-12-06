from flask import request, Flask
import json
import os

app = Flask(__name__)

# 参数设置
tk_path_true = '题库_排序版.json' # 题库路径
tk_path_false = '题库_错题缓存.json' # 题库路径

# 内存题库
tk_true = {}
tk_false = {}

if os.path.exists(tk_path_true):
    with open(tk_path_true, 'r', encoding="utf8") as f:
        tk_true = json.loads(f.read())
if os.path.exists(tk_path_false):
    with open(tk_path_false, 'r', encoding="utf8") as f:
        tk_false = json.loads(f.read())



class Qustion:
    @staticmethod
    def sort(recept_question):
        str_list = recept_question.split("|")
        q = str_list[0]
        a = sorted(str_list[1:])
        query_question = "|".join([q] + a)
        return query_question


@app.route('/query', methods=['POST'])
def query_question():
    recept_question = request.form['question']
    query_question = Qustion.sort(recept_question)
    print("查询:", query_question, end="---->")
    answers = query_question.split("|")[1:]
    if query_question in tk_true:
        print("正确答案：", tk_true[query_question])
        return tk_true[query_question]
    else:
        false_answers = tk_false.get(query_question, [])
        flag_exit_break = False
        for answer in answers:
            if answer in false_answers:
                continue
            else:
                flag_exit_break = True
                break
        print("挑选答案：", answer)
        if flag_exit_break:
            return answer
        else:
            print("删除问题：", query_question)
            tk_false.pop(query_question)
            return answer


@app.route('/submit/true', methods=['POST'])
def submit_question_true():
    recept_question = request.form['question']
    recept_answer = request.form['answer']
    query_question = Qustion.sort(recept_question)
    print("上传:", query_question, end="---->")
    if (query_question not in tk_true) or (tk_true[query_question] != recept_answer):
        tk_true[query_question] = recept_answer
        print("上传正确答案：", recept_answer)
        save()
    else:
        tk_true[query_question] = recept_answer
        print("上传正确答案：", recept_answer)
    if query_question in tk_false:
        tk_false.pop(query_question)
    return recept_answer


@app.route('/submit/false', methods=['POST'])
def submit_question_false():
    recept_question = request.form['question']
    recept_answer = request.form['answer']
    query_question = Qustion.sort(recept_question)
    print("上传:", query_question, end="---->")
    false_answers = tk_false.get(query_question, [])
    if recept_answer not in false_answers:
        false_answers.append(recept_answer)
        tk_false[query_question] = false_answers
        print("上传错误答案：", recept_answer)
        save()
    else:
        print("上传错误答案：", recept_answer)
    return recept_answer


@app.route('/save', methods=['GET'])
def save():
    with open(tk_path_true, 'w', encoding="utf8") as f:
        f.write(json.dumps(tk_true, ensure_ascii=False))
    with open(tk_path_false, 'w', encoding="utf8") as f:
        f.write(json.dumps(tk_false, ensure_ascii=False))
    print("****************保存题库成功****************")
    return 'ok'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
    