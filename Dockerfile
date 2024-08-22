# Copyright (c) 2022-2024 Ronan LE MEILLAT
# This program is licensed under the AGPLv3 license.

FROM golang:1.21 AS builder
# Copy local code to the container image.
WORKDIR /build
COPY . /build/
RUN go mod download
RUN go build -o web-smtp .
FROM ubuntu:latest

RUN apt-get update && apt-get install -y ca-certificates

WORKDIR /app
COPY --from=builder /build/web-smtp /app/

EXPOSE 8080

CMD ["/app/web-smtp"]