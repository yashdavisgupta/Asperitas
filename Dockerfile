FROM node:14-buster
RUN apt update && apt install libtinfo5
RUN npm install --global pnpm spago
COPY packages.dhall .
COPY spago.dhall .
RUN spago install
WORKDIR /usr/app
COPY package.json .
RUN pnpm install --quiet
COPY . .
