FROM 716391694722.dkr.ecr.ap-southeast-2.amazonaws.com/mcc-back:prod_baseimage

RUN apt-get update \
    && apt-get install -yq --no-install-recommends cron \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY . .

CMD [ "bash", "run-cron.sh" ]