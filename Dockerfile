FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install -timeout=9999999

CMD ["npm", "run", "dev"]
