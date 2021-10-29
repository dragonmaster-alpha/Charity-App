FROM 896549618545.dkr.ecr.us-east-1.amazonaws.com/mcc-back:stage_baseimage

RUN pip install celery[redis]

WORKDIR /src
COPY . .

#CMD [ "celery", "-A", "zen beat", "-l", "info" ]
CMD [ "bash", "run-celery.sh" ]