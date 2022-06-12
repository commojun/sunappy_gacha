FROM golang:1.18-bullseye AS builder
# プロジェクトルートをcontextとしてビルドすることを想定している

COPY ./ /src/
WORKDIR /src

RUN make bin/init

FROM debian:bullseye

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y cron && \
    apt-get clean

COPY --from=builder /src/bin/init /init
COPY ./docker/cron/run.sh /run.sh
COPY ./docker/cron/crontab /etc/cron.d/cron

# ログを標準出力へ出力できるようにシンボリックリンクを作成する
RUN chmod 0644 /etc/cron.d/cron && ln -sf /proc/1/fd/1 /var/log/cron.log

CMD ["/run.sh"]
