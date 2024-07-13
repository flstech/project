FROM node:latest

# Install MongoDB client
RUN apt-get update && apt-get install -y mongodb-clients

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4004

# Command to run the app
CMD ["node", "server.js"]
