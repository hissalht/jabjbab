#build stage for a Node.js application
FROM node:lts-alpine as build-stage
ARG VITE_SOCKETIO_URL 
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile
COPY . /app/
RUN yarn build

#production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
