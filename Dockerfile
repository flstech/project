FROM node:latest

# Install MongoDB client
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && \
    apt-get install -y mongodb-org-shell

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
