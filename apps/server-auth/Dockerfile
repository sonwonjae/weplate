FROM node:22.14.0

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm build

CMD ["pnpm", "start"]
