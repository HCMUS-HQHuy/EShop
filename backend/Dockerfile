FROM node:20.19
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run start:build
RUN npm run start:copyTemplate

EXPOSE 8220
CMD ["npm", "run", "start:run"]