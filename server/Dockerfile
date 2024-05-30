FROM node:21-alpine
LABEL authors="yiajmhat"

WORKDIR /src

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 8001
VOLUME /app/node_modules

CMD ["npm","run","start"]
