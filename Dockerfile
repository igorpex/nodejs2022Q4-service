FROM node:lts-alpine
# WORKDIR /app
WORKDIR /usr/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run audit
# RUN npm audit fix
EXPOSE 4000
CMD ["npm", "start"]
