FROM python:3.8

WORKDIR /app

RUN apt-get update && apt-get install -y \
    pocketsphinx \
    swig \
    libpulse-dev \
    libasound2-dev

COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY . /app/


CMD ["celery", "-A", "tasks", "worker"]
