#!/bin/sh
set -eu

echo "Generating Prisma client..."
npm run prisma:generate --workspace server

echo "Applying database migrations..."
npx prisma migrate deploy --schema server/prisma/schema.prisma

echo "Seeding development data..."
npm run prisma:seed --workspace server

echo "Starting server..."
exec npm run dev --workspace server
