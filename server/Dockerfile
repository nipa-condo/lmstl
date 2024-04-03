ARG NODE_VERSION=16.14.0

FROM node:${NODE_VERSION}-alpine as deps

WORKDIR /app                                                                                                      

RUN apk add --no-cache libc6-compat python3 make g++                                                              

COPY package.json yarn.lock ./                                                                                    
RUN yarn install --frozen-lockfile                                                                                

FROM node:${NODE_VERSION}-alpine as builder
WORKDIR /app                                                                                                      

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat                                                                               

COPY --from=deps /app/node_modules ./node_modules                                                                 
COPY . .                                                                                                          

RUN yarn build                                                                                                    

FROM node:${NODE_VERSION}-alpine as runner
WORKDIR /app                                                                                                      

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat bash

ENV PORT 3000                                                                                                     
ENV NODE_ENV production                                                                                           

COPY --from=deps /app/node_modules ./node_modules                                                                 
COPY --from=builder /app/dist ./dist                                                                              
COPY --from=builder /app/package.json ./package.json                                                              
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src/ormconfig.ts ./src/ormconfig.ts
COPY --from=builder /app/src/migrations ./src/migrations

COPY docker-entrypoint.sh /app
RUN chmod +x /app/docker-entrypoint.sh

USER node                                                                                                         

EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]