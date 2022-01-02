# multi stages build process by use multiple base images.
# build phase and run phase.

# by doing a multi stage build, the host container "nginx" dont need 
# anything from previous stage. In the case, we dont need all the node_modules, packages, etc

# "as builder", builder is the stage name
FROM node:16-alpine as builder

WORKDIR '/app'
COPY package.json .
RUN npm install 
COPY . .

CMD [ "npm", "run", "build" ]

# the build result will be @ /app/build

# Use nginx to run app. 
FROM nginx 
EXPOSE 3000
 
# refer to docker hub nginx: https://hub.docker.com/_/nginx 
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

