from flask import Blueprint, request, current_app
from .models import TikuIO, Qustion
from .errors import check_question, check_answer
import os

tiku = Blueprint('tiku', __name__, url_prefix='/tiku')

tkobj = TikuIO(os.path.join(current_app.root_path, current_app.config.get("tkpath", "../题库_排序版.json")))
tkdict = tkobj.tiku


@tiku.route('/query', methods=['POST'])
def query_question():
    recept_question = request.form['q']
    check_question(recept_question)
    query_question = Qustion.sort(recept_question)
    answer = tkdict.get(query_question, None)
    check_answer(answer)
    return answer


@tiku.route('/add', methods=['POST'])
def add_question():
    recept_question = request.form['q']
    recept_answer = request.form['a']
    check_question(recept_question)
    query_question = Qustion.sort(recept_question)
    if not tkdict.get(query_question, False):
        tkdict[query_question] = recept_answer
    return recept_answer


@tiku.route('/save', methods=['GET'])
def save_tiku():
    tkobj.save()
    return "OK"