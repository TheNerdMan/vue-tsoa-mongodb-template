# Create image based on the official Node image from dockerhub
FROM node:22-alpine AS test

# Create app directory
WORKDIR /usr/src/app

# Install git if needed at build time
RUN apk add --no-cache git

# Copy dependency definitions and install
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy app source
COPY . .

EXPOSE 42001

# Start dev server
CMD ["npm", "run", "dev"]

FROM node:22-alpine AS prod

# Create app directory
WORKDIR /usr/src/app

# Install git if needed at build time
RUN apk add --no-cache git

# Copy dependency definitions and install
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy app source
COPY . .

# Build ready for the host to grab the dist folders
CMD ["npm", "run", "build"]