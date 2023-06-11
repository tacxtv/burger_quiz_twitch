ARG NODE_VERSION=18-alpine

FROM node:${NODE_VERSION} AS builder
LABEL org.opencontainers.image.authors="12997062+tacxou@users.noreply.github.com"

WORKDIR /usr/src/app

ADD Makefile .
ADD package.json .
ADD *.lock .

RUN yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000

CMD ["yarn", "start:prod"]
