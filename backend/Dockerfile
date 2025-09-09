FROM node:20.19
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run start:build

EXPOSE 8220
CMD ["npm", "run", "migrate:deploy", "&&" , "npm", "run", "start:run"]