FROM 716391694722.dkr.ecr.ap-southeast-2.amazonaws.com/mcc-back:prod_baseimage

RUN pip install celery[redis]

WORKDIR /src
COPY . .

#CMD [ "celery", "-A", "zen worker", "-l", "info" ]
CMD [ "bash", "run-worker.sh" ]