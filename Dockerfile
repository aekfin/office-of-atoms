# Dockerfile
FROM node:16.14.2-alpine

# create destination directory
RUN mkdir -p /usr/src/office-of-atoms
WORKDIR /usr/src/office-of-atoms

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/office-of-atoms/
RUN npm install
RUN npm run build

EXPOSE 3105

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3105

CMD [ "npm", "start" ]