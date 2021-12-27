
FROM node:14.14.0-alpine

WORKDIR '/app'

COPY package.json .

RUN npm install

COPY . .
#note the "start" command is what we defined in package.json
CMD [ "npm", "run", "start" ]
