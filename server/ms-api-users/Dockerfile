FROM node:20.9.0
WORKDIR /app
COPY package*.json .
RUN yarn
COPY . .
EXPOSE 3011
CMD yarn start
