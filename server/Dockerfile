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
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace", "server"]

FROM base AS build
COPY server ./server
COPY shared ./shared
RUN npm run build --workspace server

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY shared/package.json ./shared/package.json
RUN npm install --omit=dev --workspace server
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/prisma ./server/prisma
USER appuser
EXPOSE 3000
CMD ["node", "server/dist/server.js"]
