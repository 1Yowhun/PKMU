# Tahap 1: Build stage
FROM node:20-alpine3.17 AS builder

RUN apk update \
	&& apk add --no-cache openssl\
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file proyek
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build aplikasi Next.js
RUN npm run build

# Tahap 2: Production stage (run app)
FROM node:20-alpine3.17

WORKDIR /app

# Copy hasil build dan file yang dibutuhkan dari builder
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma 
COPY --from=builder /app/generated ./generated

EXPOSE 3000

CMD ["npm", "start"]
