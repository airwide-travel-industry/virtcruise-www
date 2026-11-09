FROM node:20-bookworm-slim AS build
WORKDIR /app
RUN apt-get update \
    && apt-get install --no-install-recommends --yes zip \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build:production-beta4

FROM nginx:1.29-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/virtcruise-www-0.8.0-beta.4/ /usr/share/nginx/html/
RUN mkdir -p /var/cache/nginx/client_temp /var/run/nginx /var/log/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run/nginx /var/log/nginx \
    && chown nginx:nginx /etc/nginx/conf.d/default.conf \
    && sed -i 's#pid[[:space:]]\+/run/nginx.pid;#pid /tmp/nginx.pid;#' /etc/nginx/nginx.conf
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
