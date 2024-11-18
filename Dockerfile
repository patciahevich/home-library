FROM node:18-alpine

WORKDIR /app

COPY . .

RUN  npm install --legacy-peer-deps


RUN npx prisma generate


EXPOSE 4000

CMD ["npm", "run", "start"]
