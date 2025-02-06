FROM node:lts-bullseye

# set working directory
WORKDIR /app


# install app dependencies
COPY package*.json ./

RUN npm install --legacy-peer-deps 

COPY . ./

RUN npm run build

EXPOSE 3000

# start app
CMD ["npm", "run", "start"]


