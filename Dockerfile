FROM node:20

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
