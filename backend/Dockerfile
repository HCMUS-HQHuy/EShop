FROM node:20.19
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 8220
CMD ["npm", "run", "dev"]