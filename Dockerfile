# Base stage for dependencies
FROM node:22-alpine AS base
# Install dependencies for canvas (PDF generation)
RUN apk add --no-cache libc6-compat python3 make g++ cairo-dev pango-dev jpeg-dev giflib-dev
WORKDIR /app

# Dependency installation stage
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Development stage with hot reload
FROM base AS dev
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Builder stage for production
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage (minimal size)
FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy standalone output from Next.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Next.js standalone build requires these
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# Test runner stage
FROM base AS test
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "test:ci"]