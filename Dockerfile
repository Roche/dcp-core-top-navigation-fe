ARG BASE_IMAGE_VERSION
ARG BASE_IMAGE_NAME

# Stage 1: Build
FROM node:20.19.6-alpine AS build-stage
WORKDIR /app

COPY package*.json .npmrc ./
COPY scripts ./scripts
RUN npm ci --ignore-scripts && rm -f .npmrc
COPY src ./src
COPY module-settings ./module-settings
COPY angulartics2 ./node_modules/angulartics2
COPY angular.json tsconfig.json tsconfig.app.json extra-webpack.config.js build-timeout.js update-app-data-main-file.js ./
RUN npm run build

# Stage 2: Production
FROM ${BASE_IMAGE_NAME}:${BASE_IMAGE_VERSION} AS production-stage

# Copy the built files
COPY --from=build-stage --chown=appuser:appuser --chmod=555 /app/dist /usr/share/nginx/html
COPY --chown=appuser:appuser --chmod=444 config.json.template /etc/nginx/config.json.template

RUN find /usr/share/nginx/html -type f -exec chmod 444 {} + \
	&& chmod u+w /usr/share/nginx/html

USER appuser
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]