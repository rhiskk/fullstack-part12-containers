FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

USER node

ENV DEBUG=playground:*

RUN npm run tsc

CMD npm start
