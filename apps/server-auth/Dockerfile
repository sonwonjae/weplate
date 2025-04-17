FROM node:22.14.0

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .
RUN pnpm install --filter server-auth
RUN pnpm build --filter server-auth

CMD ["pnpm", "--filter", "server-auth", "start"]