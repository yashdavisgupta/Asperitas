FROM node:14
RUN npm install --global pnpm
WORKDIR /usr/app
COPY package.json .
RUN pnpm install --quiet
COPY . .
