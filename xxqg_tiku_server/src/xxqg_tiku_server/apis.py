from flask import Blueprint, request, current_app
from .models import Qustion
from .errors import check_question, check_answer
from .database import SQLDataBase

bp_tiku = Blueprint('tiku', __name__)

tkpath = current_app.config.get("tkpath", "default.db")
if tkpath is None:
    raise Exception("空的题库路径")
tk = SQLDataBase(tkpath)

@bp_tiku.route('/query', methods=['POST'])
def query_question():
    recept_question = request.form['q']
    check_question(recept_question)
    query_question = Qustion.sort(recept_question)
    print(query_question)
    answer = tk.get(query_question, None)
    print(answer)
    check_answer(answer)
    return answer


@bp_tiku.route('/add', methods=['POST'])
def add_question():
    recept_question = request.form['q']
    recept_answer = request.form['a']
    check_question(recept_question)
    query_question = Qustion.sort(recept_question)
    print(query_question)
    if not tk.get(query_question, False):
        tk.insert(question=query_question, answer=recept_answer)
    return recept_answer
