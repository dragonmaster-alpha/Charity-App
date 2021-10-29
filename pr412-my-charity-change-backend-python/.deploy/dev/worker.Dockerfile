FROM 896549618545.dkr.ecr.us-east-1.amazonaws.com/mcc-back:dev_baseimage

RUN pip install celery[redis]

WORKDIR /src
COPY . .

#CMD [ "celery", "-A", "zen worker", "-l", "info" ]
CMD [ "bash", "run-worker.sh" ]