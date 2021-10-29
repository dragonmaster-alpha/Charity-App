FROM 716391694722.dkr.ecr.ap-southeast-2.amazonaws.com/mcc-back:prod_baseimage

RUN pip install gunicorn

WORKDIR /src
COPY . .

CMD [ "bash", "run.sh" ]