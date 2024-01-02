FROM node:lts-alpine
WORKDIR /app
COPY package*.json .
RUN yarn
COPY . .
EXPOSE 3012
CMD yarn start
