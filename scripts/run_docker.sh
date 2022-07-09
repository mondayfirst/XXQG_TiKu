#!/bin/bash
cd /root/app/XXQG_TiKu
nohup gunicorn wsgi:app -c gunicorn.conf.py > server.log 2>&1 &
/bin/bash