FROM python:3.9-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install
COPY XXQG_TiKu/xxqg_tiku_server /etc/xxqg/xxqg_tiku_server
RUN pip3 install /etc/xxqg/xxqg_tiku_server

# Create Wsgi File
RUN echo 'from xxqg_tiku_server import create_app\napp = create_app({"tkpath":"/etc/xxqg/db/xxqg_tiku.db"})' > /etc/xxqg/wsgi.py

# # Create Start File
# RUN echo '#!/bin/bash\ncd /etc/xxqg\nnohup gunicorn /etc/xxqg/wsgi:app --workers 4 -b 0.0.0.0:5000 --worker-class gevent > /etc/xxqg/server.log 2>&1 &\ntail -f /dev/null' >> /root/.start.sh


# ENTRYPOINT ["/bin/bash", "/root/.start.sh"]