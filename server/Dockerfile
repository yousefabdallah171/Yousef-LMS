FROM node:20-alpine AS base
WORKDIR /app
COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY shared/package.json ./shared/package.json
RUN npm install

FROM base AS dev
COPY server ./server
COPY shared ./shared
WORKDIR /app
RUN npm run prisma:generate --workspace server
EXPOSE 3000
CMD ["sh", "server/scripts/docker-dev-entrypoint.sh"]

FROM base AS build
COPY server ./server
COPY shared ./shared
RUN npm run prisma:generate --workspace server
RUN npm run build --workspace server

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY server/prisma ./server/prisma
COPY shared/package.json ./shared/package.json
RUN npm install --omit=dev --workspace server
COPY --from=build /app/server/dist ./server/dist
USER appuser
EXPOSE 3000
CMD ["node", "server/dist/server.js"]
