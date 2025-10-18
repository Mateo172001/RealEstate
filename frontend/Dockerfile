# ######################################
# ## (Builder) ##
# ######################################

FROM node:22-alpine AS builder


WORKDIR /app

ARG NEXT_PUBLIC_API_URL
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" > .env.production

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# #####################################
# ## (Runner) ##
# #####################################

FROM node:22-alpine AS runner

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/.env.production ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "start"]