# Create image based on the official Node image from dockerhub
FROM node:22-alpine AS test

# Create app directory
WORKDIR /usr/src/app

# Install git if needed at build time
RUN apk add --no-cache git

# Copy dependency definitions and install without running lifecycle scripts
# so "prepare" (which runs kiota) does not execute during image build.
COPY package.json package-lock.json ./
RUN npm ci --silent --ignore-scripts

# As our client SDK is committed to the repo it should also was be a this location
COPY node_modules/@memory-soup-client/api ./node_modules/@memory-soup-client/api

# Copy app source
COPY . .

EXPOSE 42000

# Start dev server
CMD ["npm", "run", "dev"]

FROM node:22-alpine AS prod

# Create app directory
WORKDIR /usr/src/app

# Install git if needed at build time
RUN apk add --no-cache git

# Copy dependency definitions and install without running lifecycle scripts
# so "prepare" (which runs kiota) does not execute during image build.
COPY package.json package-lock.json ./
RUN npm ci --silent --ignore-scripts

# As our client SDK is committed to the repo it should also was be a this location
COPY node_modules/@memory-soup-client/api ./node_modules/@memory-soup-client/api

# Copy app source
COPY . .

# Build ready for the host to grab the dist folders
CMD ["npm", "run", "build"]