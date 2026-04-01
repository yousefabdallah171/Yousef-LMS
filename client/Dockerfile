FROM node:20-alpine AS base
WORKDIR /app
COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY shared/package.json ./shared/package.json
RUN npm install

FROM base AS dev
COPY client ./client
COPY shared ./shared
WORKDIR /app
EXPOSE 5173
CMD ["npm", "run", "dev", "--workspace", "client", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM base AS build
COPY client ./client
COPY shared ./shared
RUN npm run build --workspace client

FROM nginx:1.27-alpine AS prod
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
