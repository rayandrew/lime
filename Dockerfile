FROM node:boron-alpine

RUN npm install -g -s --no-progress yarn
RUN npm install -g -s --no-progress nodemon

# Create app directory and set as working directory
RUN mkdir -p /usr/src/lime
WORKDIR /usr/src/lime

# Use default node (non-root) user
USER node

# Install app dependencies (done before copying app source to optimize caching)
COPY package.json /usr/src/lime/

# Permission problem fix
USER root
RUN chown -R node:node /usr/src/lime
USER node

RUN yarn

# Copy app source to container
COPY . /usr/src/lime

# Permission problem fix
USER root
RUN chown -R node:node /usr/src/lime
USER node

EXPOSE 3000 3001 3002

CMD ["yarn", "start"]