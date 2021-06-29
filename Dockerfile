FROM node:10.16.0-alpine
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./
COPY ./src ./src
COPY ./.env .
COPY ./.eslintrc .
COPY ./.eslintignore .
COPY ./jest.config.js .
COPY ./jest.setup-file.ts .
COPY ./junit-TEST.xml .
COPY ./tsconfig.json .
COPY ./health-check.js .
COPY ./tests ./tests
RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*
RUN npm install
RUN npm run test
ARG token_auth
ARG session_secret
ARG node_port
ENV NODE_PORT=$node_port
ENV NODE_ENV=production
ENV TOKEN_AUTHENTICATION=$token_auth
ENV SESSION_SECRET=$session_secret
RUN npm run build
EXPOSE $node_port
CMD [ "npm", "start" ]
