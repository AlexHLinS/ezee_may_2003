FROM python:3.9
SHELL ["/bin/bash", "-c"]
WORKDIR src/

COPY ./requirements.txt .

RUN pip --no-cache-dir install --upgrade -r requirements.txt

COPY ./src /src

CMD ["uvicorn",  "app:app", "--host", "0.0.0.0", "--port", "8000"]
