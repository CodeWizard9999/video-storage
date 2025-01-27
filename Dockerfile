FROM node:16


USER root
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production
RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_amd64.deb
RUN dpkg -i dumb-init_*.deb

ENV NODE_ENV production

COPY . .

EXPOSE 8000

CMD ["dumb-init", "npm", "run", "start"]
