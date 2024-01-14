ARG NODE_VERSION=18-alpine

FROM node:${NODE_VERSION} AS builder
LABEL org.opencontainers.image.authors="12997062+tacxou@users.noreply.github.com"

WORKDIR /usr/src/app

COPY . .

ADD Makefile .

RUN cd app && yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false && \
    yarn generate

WORKDIR /usr/src/app

RUN cd server && yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false && \
    yarn build

WORKDIR /usr/src/app/server

EXPOSE 4000

CMD ["yarn", "start:prod"]
