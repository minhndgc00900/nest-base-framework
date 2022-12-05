FROM node:16.3.0-alpine
# set working directory
WORKDIR /app

# Fix for heap limit allocation issue
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY [".env.example", ".env"]

COPY package*.json ./

RUN npm install

COPY . /app

RUN npm run build

CMD ["npm", "run", "start"]
