FROM ubuntu:24.04
RUN apt update
RUN apt install -y postgresql
WORKDIR /bd


