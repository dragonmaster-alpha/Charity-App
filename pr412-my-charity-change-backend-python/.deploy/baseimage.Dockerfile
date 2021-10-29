FROM python:3.8.3-slim

ENV TZ=Europe/London \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /src

COPY Pipfile /src
COPY Pipfile.lock /src
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update \
    && apt-get install -yq --no-install-recommends \
        tini \
        python3-dev \
        git \
        gcc \
        gdal-bin \
        libcairo2-dev \
    && pip install git+https://github.com/pypa/pipenv \
    && pipenv install --system --deploy --ignore-pipfile \
    && apt-get -y purge gcc \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT [ "tini", "--" ]