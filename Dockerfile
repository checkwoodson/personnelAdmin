FROM node:latest
WORKDIR /www/node-server/
COPY package.json /www/node-server/package.json
RUN npm install
COPY . /www/node-server/
EXPOSE 5490
CMD npm run start:dev
