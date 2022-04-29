import pytest
import server_app
import json
import os


@pytest.fixture
def client():
    config_dict = {"tkpath": "../题库_测试.json"}
    app = server_app.create_app(config_dict)
    app.config.update()
    with app.test_client() as client:
        yield client


def test_add_question(client):
    data = {"q": "问题1|答案1|答案2", "a": "答案1"}
    rv = client.post('/tiku/add', data=data)
    assert "答案1" in rv.get_data(as_text=True)


def test_query_question(client):
    data = {"q": "问题1|答案1|答案2"}
    rv = client.post('/tiku/query', data=data)
    assert "答案1" in rv.get_data(as_text=True)


def test_save_tiku(client):
    file_path = os.path.join(os.path.dirname(__file__), "..")
    json_path = os.path.join(file_path, "题库_测试.json")
    md_path = os.path.join(file_path, "题库_测试.md")
    data = {"q": "问题1|答案1|答案2", "a": "答案1"}
    rv = client.get('/tiku/save', data=data)
    assert "OK" in rv.get_data(as_text=True)
    with open(json_path, "r", encoding="utf8") as f:
        data_t = json.loads(f.read())
    assert {data["q"]: data["a"]} == data_t
    os.remove(json_path)
    os.remove(md_path)
    assert not os.path.exists(md_path)


def test_query_error_question_null(client):
    data = {"q": ""}
    rv = client.post('/tiku/query', data=data)
    assert str("Question is null.") in rv.get_data(as_text=True)


def test_query_error_question_lenth(client):
    objstr = "00" * 2000 + "|3|2|1"
    data = {"q": objstr}
    rv = client.post('/tiku/query', data=data)
    assert "Question is too long." in rv.get_data(as_text=True)


def test_query_error_question_format(client):
    data = {"q": "5"}
    rv = client.post('/tiku/query', data=data)
    assert "Question's format is not intended." in rv.get_data(as_text=True)


def test_query_error_question_answer_num(client):
    data = {"q": "5|1"}
    rv = client.post('/tiku/query', data=data)
    assert "The number of your answers must be greater than 1!" in rv.get_data(as_text=True)


def test_query_error_answer_not_found(client):
    data = {"q": "5|1|2"}
    rv = client.post('/tiku/query', data=data)
    assert "Answer not found" in rv.get_data(as_text=True)
