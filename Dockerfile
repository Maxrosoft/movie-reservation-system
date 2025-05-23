FROM node:23-slim
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
# CMD ["npx", "tsx", "./src/app.ts"]
