nohup gunicorn wsgi:app -c gunicorn.conf.py > server.log 2>&1 &
# ps -ef | grep gunicorn | grep -v grep | awk '{print "kill -9 "$2}' | sh