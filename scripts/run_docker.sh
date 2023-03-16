#!/bin/bash
nohup gunicorn /var/xxqg/wsgi:app --workers 4 -b 0.0.0.0:5000 --worker-class gevent > /var/xxqg/server.log 2>&1 &
tail -f /dev/null
#!/bin/bash
cd /etc/xxqg
nohup gunicorn /etc/xxqg/wsgi:app --workers 4 -b 0.0.0.0:5000 --worker-class gevent > /etc/xxqg/server.log 2>&1 &
tail -f /dev/null

# ps -ef | grep wsgi:app | grep -v grep | awk '{print "kill -9 "$2}' | sh
# nohup gunicorn wsgi:app --workers 4 -b 0.0.0.0:5000 --worker-class gevent > server.log 2>&1 &