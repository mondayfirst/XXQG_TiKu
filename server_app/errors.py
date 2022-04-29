from flask import current_app, abort
from werkzeug.wrappers.response import Response

app = current_app


class CustomException(Exception):
    def __init__(self, code, error_code, description):
        self.code = code
        self.error_code = error_code
        self.description = description

    def __str__(self):
        return str({"code": self.error_code, "msg": self.description})

    def __call__(self):
        return self.to_response()

    def to_response(self):
        return Response(str(self), self.code)


@app.errorhandler(CustomException)
def errors(e: CustomException):
    return str(e), e.code


def check_question(recept_question):
    if not recept_question:
        abort(error_question_null())
    if len(recept_question) > 4000:
        abort(error_question_lenth())
    if not "|" in recept_question:
        abort(error_question_format())
    if len(recept_question.split("|")) <= 2:
        abort(error_question_answer_num())


def check_answer(send_answer):
    if send_answer is None:
        abort(error_answer_not_found())
    if send_answer == "":
        abort(error_answer_not_found())


error_question_null = CustomException(400, 1001, "Question is null.")
error_question_lenth = CustomException(400, 1002, "Question is too long.")
error_question_format = CustomException(400, 1003, "Question's format is not intended.")
error_question_answer_num = CustomException(400, 1004, "The number of your answers must be greater than 1!")
error_answer_not_found = CustomException(400, 2001, "Answer not found")
