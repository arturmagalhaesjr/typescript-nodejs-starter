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
RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*
ENV NODE_ENV=production
ENV NODE_PORT=5002
RUN npm test
RUN npm install
RUN npm run build
EXPOSE 5002
CMD [ "npm", "start" ]
