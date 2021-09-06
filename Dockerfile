FROM node:16.8-alpine AS client-builder
WORKDIR /client-build
COPY ./client/ .
RUN yarn install && \
    yarn build

FROM node:16.8-alpine AS server-builder
WORKDIR /server-build
COPY ./server/ .
RUN yarn install && \
    yarn build

FROM node:16.8-alpine
WORKDIR /app
COPY --from=server-builder /server-build/package.json .
COPY --from=server-builder /server-build/dist/ ./dist/
RUN yarn install --production
COPY --from=client-builder /client-build/build/ ./dist/www/
EXPOSE 80
CMD ["node", "dist/index.js"]
