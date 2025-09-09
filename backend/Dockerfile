FROM node:20.19
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma migrate deploy
RUN npm run start:build

EXPOSE 8220
CMD ["npm", "run", "start:run"]