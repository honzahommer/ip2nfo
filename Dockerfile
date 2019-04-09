FROM node:10

WORKDIR /usr/src/app
COPY package* ./

RUN npm install
COPY . .

ENV NODE_ENV production
EXPOSE 3000
CMD [ "npm", "start" ]