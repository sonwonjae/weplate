FROM node:22.14.0

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .
RUN pnpm install
RUN pnpm build

CMD ["pnpm", "start"]
