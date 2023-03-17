# How to build a docker container to run this project in Linux
## 1. Build
### 1.1 By DockerFile
#### Create a docker file
```
mkdir temp_dockerfile
vim temp_dockerfile/Dockerfile
cd temp_dockerfile
git clone https://github.com/mondayfirst/XXQG_TiKu.git
cd ..
```
Dockerfile content shows as below:
```
FROM python:3.9-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install
COPY XXQG_TiKu/xxqg_tiku_server /etc/xxqg/xxqg_tiku_server
RUN pip3 install /etc/xxqg/xxqg_tiku_server

# Create Wsgi File
RUN echo 'from xxqg_tiku_server import create_app\napp = create_app({"tkpath":"/etc/xxqg/db/xxqg_tiku.db"})' > /etc/xxqg/wsgi.py

# Create Start File
RUN echo '#!/bin/bash\ncd /etc/xxqg\nnohup gunicorn wsgi:app --workers 4 -b 0.0.0.0:5000 --worker-class gevent > /etc/xxqg/server.log 2>&1 &\ntail -f /dev/null' >> /root/.start.sh


ENTRYPOINT ["/bin/bash", "/root/.start.sh"]
```
#### Build image from dockerfile
```
# Build
docker build -t xxqgtiku-server:latest ./temp_dockerfile
# Delete TempFiles
rm -r temp_dockerfile
```

### 1.2 By DockerHub
```
docker pull mondayfirst/xxqgtiku-server:latest
```
## 2. Run
```
# Set params
export ContainerName=xxqg   # 容器名称
export ExternalPort=10000   # 本地端口
export ExternalPath=/root/xxqg # 本地环境xxqg_tiku.db所在的文件夹，没有同名文件则自动创建

# Run
docker run --restart=always --name=${ContainerName} -p ${ExternalPort}:5000 \
    -v ${ExternalPath}:/etc/xxqg/db -itd mondayfirst/xxqgtiku-server:latest \
    gunicorn /etc/xxqg/wsgi:app --workers 4 -b 0.0.0.0:5000 --worker-class gevent

# Test
python3
>>> import requests
>>> data = {"q": "扑救火灾最有利的阶段是        。|火灾初起阶段|火灾发展阶段|火灾猛烈燃烧阶段"}
>>> url = "http://127.0.0.1:10000/query" # 注意自己的端口设置，自行修改！！！！！
>>> response = requests.post(url, data)
>>> print(response.status_code, response.text)
200 火灾初起阶段
```