# 学习强国_挑战答题 服务端


### 1. 安装所需Python包
```
pip install flask
```

### 2. 启动server程序
原始代码监听本机的5000端口，可自行前往脚本处设置
```
python xxqg_tiku_server/simple_server.py
```

### 3. 测试是否运行(Python代码)   

注意自己的端口设置，自行修改！
```
import requests
data = {"question": "扑救火灾最有利的阶段是        。|火灾初起阶段|火灾发展阶段|火灾猛烈燃烧阶段"}
# 注意自己的端口设置，自行修改IP地址和端口
url = "http://127.0.0.1:5000/query" 
response = requests.post(url, data)
print(response.status_code, response.text)
```