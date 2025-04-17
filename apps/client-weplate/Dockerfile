FROM node:22.14.0

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .
RUN pnpm install --filter client-weplate
RUN pnpm build --filter client-weplate

CMD ["pnpm", "--filter", "client-weplate", "start"]