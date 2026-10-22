FROM node:24-bookworm-slim
WORKDIR /app
COPY deploy/oracle/app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund
COPY --chown=node:node deploy/oracle/app/server.mjs deploy/oracle/app/runtime.mjs deploy/oracle/app/migrate.mjs ./
COPY --chown=node:node deploy/oracle/app/migrations ./migrations
COPY --chown=node:node lib/accounts.mjs ./accounts.mjs
COPY --chown=node:node public ./public
COPY --chown=node:node ui ./ui
RUN mkdir -p /data && chown node:node /data
USER node
ENV HOST=0.0.0.0 PORT=3000 DB_PATH=/data/saveurel.sqlite
EXPOSE 3000
CMD ["sh","-c","node migrate.mjs && exec node server.mjs"]
