FROM node:20

WORKDIR /api

COPY package.json package-lock.json .

COPY ./api .

RUN npm ci

EXPOSE 4000

CMD ["npm", "run", "api"]