FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN pnpm install --frozen-lockfile

COPY . .

WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm nest build

EXPOSE 3333

CMD ["node", "dist/main"]