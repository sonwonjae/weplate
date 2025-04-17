FROM node:22.14.0

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .
RUN pnpm install --filter server-api
RUN pnpm build --filter server-api

CMD ["pnpm", "--filter", "server-api", "start"]