FROM node:lts-alpine
# WORKDIR /app
WORKDIR /usr/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run audit
RUN npm run prisma:generate
# RUN npm run prisma:migrate
EXPOSE 4000
CMD ["npm", "start"]