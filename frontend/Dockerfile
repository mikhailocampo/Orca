# frontend/Dockerfile
FROM node:16-alpine as builder

WORKDIR /app

# Installing dependencies
COPY package.json package-lock.json ./
RUN npm install

# Building the application
COPY . .
RUN npm run build

# Production environment
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
