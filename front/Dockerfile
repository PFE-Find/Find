FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci || npm install --no-audit --no-fund

FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time only: Next.js needs these during `next build` for static pages / db.ts.
# They are NOT persisted as ENV in the final image — runtime values come from
# docker-compose.yml environment block.
ARG MONGODB_URI
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG API_URL_INTERNAL
ENV NEXT_TELEMETRY_DISABLED=1

# Temporarily set for the build command only
RUN MONGODB_URI=${MONGODB_URI} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    API_URL_INTERNAL=${API_URL_INTERNAL} \
    npm run build

FROM node:20-bookworm-slim
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000
CMD ["npm", "start"]
