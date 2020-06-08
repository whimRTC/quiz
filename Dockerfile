FROM node:lts-alpine

RUN apk update && \
    apk add git

WORKDIR /app
ENV HOST 0.0.0.0

CMD ["ash", "-c", "yarn && yarn serve"]