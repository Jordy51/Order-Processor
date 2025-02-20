FROM node:20-alpine
WORKDIR /app
COPY package.json  ./
RUN npm install yarn
RUN yarn install
RUN ls
COPY . .
CMD ["yarn", "start:dev"]
EXPOSE 3000