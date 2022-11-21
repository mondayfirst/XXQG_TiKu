ps -ef | grep wsgi:app | grep -v grep | awk '{print "kill -9 "$2}' | sh
nohup gunicorn wsgi:app -c gunicorn.conf.py > server.log 2>&1 &