# Multi-stage Docker build for OHIF Viewer
FROM node:20.18.0-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends git python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Enable Corepack & Yarn
RUN corepack enable && corepack prepare yarn@3.6.4 --activate

# Copy root dependencies files
COPY package.json yarn.lock .yarnrc.yml lerna.json ./
COPY .yarn ./.yarn

# Copy packages
COPY platform ./platform
COPY extensions ./extensions
COPY modes ./modes

# Install dependencies and build OHIF Viewer
RUN yarn install --frozen-lockfile
RUN cd platform/app && yarn build

# Production Nginx image stage
FROM nginx:alpine AS runner

COPY --from=builder /app/platform/app/dist /usr/share/nginx/html
COPY local-deployment/nginx.conf /etc/nginx/nginx.conf
COPY local-deployment/config.js /usr/share/nginx/html/config/app-config.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
