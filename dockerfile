FROM golang:1.15

WORKDIR /app

COPY . /app

RUN cd /app

CMD go run main.go