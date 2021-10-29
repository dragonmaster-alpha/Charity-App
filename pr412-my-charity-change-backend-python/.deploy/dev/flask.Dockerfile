FROM 896549618545.dkr.ecr.us-east-1.amazonaws.com/mcc-back:dev_baseimage

RUN pip install gunicorn

WORKDIR /src
COPY . .

CMD [ "bash", "run.sh" ]