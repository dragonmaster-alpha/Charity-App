FROM 896549618545.dkr.ecr.us-east-1.amazonaws.com/mcc-back:dev_baseimage

RUN apt-get update \
    && apt-get install -yq --no-install-recommends cron \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY . .

CMD [ "bash", "run-cron.sh" ]