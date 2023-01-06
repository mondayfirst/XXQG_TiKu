# 学习强国_挑战答题 服务器端库


### 1. 安装该Python包
```
git clone https://github.com/mondayfirst/XXQG_TiKu.git
cd XXQG_TIKU
# 从下两行选一个
pip install XXQG_TIKU/xxqg_tiku_server  # 正常使用
pip install XXQG_TIKU/xxqg_tiku_server[test] # 此为开发测试

```

### 2. pytest开发测试(可选)
```
pytest
```

### 3. 启动server程序
#### 通过flask开发者模式调用
```
cd xxqg_tiku_server
flask run
# * Serving Flask app 'xxqg_tiku_server' (lazy loading)
#  * Environment: development
#  * Debug mode: on
#  * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
#  * Restarting with stat
#  * Debugger is active!
#  * Debugger PIN: 139-018-991
```
#### 通过gunicorn调用
[解决gunicorn在Windows上的兼容性问题](https://stackoverflow.com/questions/1422368/fcntl-substitute-on-windows)
```
cd xxqg_tiku_server
gunicorn wsgi:app --workers 4 -b 0.0.0.0:5000 --worker-class gevent
```

### 4. 测试是否运行(Python代码)   

注意自己的端口设置，自行修改！！！！！
```
import requests
data = {"q": "扑救火灾最有利的阶段是        。|火灾初起阶段|火灾发展阶段|火灾猛烈燃烧阶段"}
# 注意自己的端口设置，自行修改！！！！！
url = "http://127.0.0.1:5000" 
response = requests.post(url, data)
print(response.status_code, response.text)
```