FROM node:20-alpine AS builder
WORKDIR /app
#COPY .env.example .env
COPY package.json ./
COPY yarn.lock ./

RUN yarn
COPY . .

RUN yarn build


FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# EXPOSE 5000

CMD ["node", "dist/main"]
 