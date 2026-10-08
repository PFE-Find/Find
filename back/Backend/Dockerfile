FROM node:20-bookworm AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev || npm install --omit=dev --no-audit --no-fund

FROM node:20-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY . .

RUN mkdir -p uploads

EXPOSE 3001
CMD ["node", "app.js"]
