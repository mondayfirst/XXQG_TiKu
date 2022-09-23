# How to build a docker container to run this project in Linux
[toc]
## 1. Build
### 1.1 By DockerFile
#### Create a docker file
```
mkdir temp_dockerfile
vim temp_dockerfile/Dockerfile
```
Dockerfile content shows as below:
```
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install commonly used tools
RUN apt-get -y update
RUN apt-get install --assume-yes apt-utils
RUN apt-get -y install vim
RUN apt-get -y install unzip
RUN apt-get -y install openssh-server
RUN apt-get -y install cron
RUN apt-get -y install python3
RUN apt-get -y install pip
RUN apt-get -y install language-pack-en
RUN apt-get -y install curl
ENV LANG="zh_CN.utf8"
RUN echo "\n0 * * * * root curl http://127.0.0.1:1880/tiku/save" >> /etc/crontab
RUN pip install gunicorn
RUN pip install gevent
RUN pip install flask
```
#### Build image from dockerfile
```
docker build -t xxqgtiku:latest ./temp_dockerfile
```



### 1.2 By System Image (Ubuntu 22.04)
```
# Create and run into the system container
container_name=test_1
docker run --name=${container_name} -itd ubuntu:22.04 bash
docker exec -ti ${container_name} bash

# Install packages
apt-get -y update
apt-get -y install apt-utils
apt-get -y install vim
apt-get -y install unzip
apt-get -y install openssh-server
apt-get -y install cron
apt-get -y install python3
apt-get -y install pip
apt-get -y install git
apt-get -y install language-pack-en
apt-get -y install curl

echo "\nservice ssh restart" >> /root/.profile
echo "\nservice cron restart\n" >> /root/.profile

# Install packages of python
pip install gunicorn
pip install gevent
pip install flask

# =====Optional: Update Repository=====
# ================Start================
# Set your ssh login
echo "PermitRootLogin yes\nPasswordAuthentication yes\nPubkeyAuthentication yes" >> /etc/ssh/sshd_config
service ssh restart

# Set git
git config --global --add safe.directory /root/app/XXQG_TiKu
git config --global user.email "Your Github Email"
git config --global user.name "Your Github Name"
git remote set-url <master> <new url> # Set your url

# Set ssh config for github login
vim ~/.ssh/config
Host github.com
    User git
    HostName ssh.github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/Your_Privatekey # Please set your Privatekey file name!
    Port 443

# Open editor in terminal
crontab -e

# Add this command at the last line in crontab file, and save it.
0 * * * * /bin/bash /root/app/XXQG_TiKu/scripts/git_push.sh 
# Now, you should have exited the editor.

service cron restart
# ================End==================
# =====Optional: Update Repository=====


# Exit the temporary container
exit

# Convert ephemeral containers to a docker image
docker stop ${container_name}
docker commit ${container_name} xxqgtiku:latest

# Delete the temporary container 
docker stop ${container_name}
docker rm ${container_name}
```
## 2. Run
```
# Set params
ContainerName = xxqg_tiku_server
ExternalPort = 1880
ExternalPath = /root/XXQG_TiKu
# Run
docker run --name=${ContainerName} -p ${ExternalPort}:1880 -v ${ExternalPath}:/root/app/XXQG_TiKu -itd xxqgtiku:latest /bin/bash /root/app/XXQG_TiKu/scripts/run_docker.sh
docker update --restart=always ${ContainerName}
```