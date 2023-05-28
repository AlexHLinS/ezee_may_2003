FROM python:3.11
SHELL ["/bin/bash", "-c"]
WORKDIR /source

COPY ./requirements.txt .

RUN pip --no-cache-dir install --upgrade -r requirements.txt

COPY ./source /source
COPY ./data /data

CMD ["python3",  "main.py"]
