FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/pomodoro-web/package.json apps/pomodoro-web/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/design-tokens/package.json packages/design-tokens/package.json
COPY packages/pomodoro-core/package.json packages/pomodoro-core/package.json

RUN pnpm install --frozen-lockfile

COPY apps/pomodoro-web apps/pomodoro-web
COPY packages/ui packages/ui
COPY packages/design-tokens packages/design-tokens
COPY packages/pomodoro-core packages/pomodoro-core

RUN pnpm --filter pomodoro-web run build

FROM nginx:alpine AS production

COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/pomodoro-web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
