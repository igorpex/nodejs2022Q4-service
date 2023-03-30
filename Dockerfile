# FROM node:lts-alpine
FROM node:16.20.0-bullseye-slim
# WORKDIR /app
USER node
WORKDIR /usr/app
COPY package*.json ./
#RUN npm install
RUN npm ci --only=production
COPY --chown=node:node . /usr/app
# COPY . .
#RUN npm run audit
RUN npm run prisma:generate
# RUN npm run prisma:migrate
# EXPOSE 4000
CMD ["npm", "start"]