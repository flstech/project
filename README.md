**Overview**

Welcome to our Node.js application project! 

This project features a simple Express server with two main endpoints:

/api/health: Checks if the server is running properly.
/api/mirror: Transforms a word by reversing it and swapping the case of each character, then saves the original and transformed words in a MongoDB database.

I've also set up a CI/CD pipeline using GitHub Actions to automate testing, building, and deploying a Docker image.

**Project Structure**
server.js: Main server file where the Express application is set up.
server-test.js: Test file for testing the API endpoints using Supertest.
package.json: Project configuration file containing dependencies and scripts.
cicd.yml: GitHub Actions workflow file for our CI/CD pipeline.


**Prerequisites**
Before you get started, make sure you have the following installed:

Node.js (version 16)
MongoDB
Docker


**Getting Started**

Clone the repository
First, clone the repository to your local machine and navigate to the project directory:
git clone <repository-url>
cd <repository-directory>

Install dependencies
Next, install the project dependencies:
npm install

Run the server
Start the server with:
node server.js

The server will be up and running on http://localhost:4004.

API Endpoints

**Health Check**

- URL: /api/health
- Method: GET
- Response:
    Status: 200
    Body: { "status": "ok" }

**Mirror Word**

- URL: /api/mirror
- Method: GET
- Query Parameters:
    word (required): The word you want to transform.

- Response:
    Status: 200
    Body: { "transformed": "<transformed-word>" }
- Error Response:
    Status: 400
    Body: { "error": "word query parameter is required" }

**Running Tests**
To run the tests we have set up in server-test.js, simply use:
npm test

**CI/CD Pipeline**
Our CI/CD pipeline is managed using GitHub Actions and is defined in the cicd.yml file. Here’s what it does:

Check out the repository code:
- uses: actions/checkout@v2

Set up Node.js:
- name: Use Node.js ${{ matrix.node-version }}
  uses: actions/setup-node@v2
  with:
    node-version: ${{ matrix.node-version }}
    cache: 'npm'

Install dependencies:
- run: npm ci

Run tests:
- run: npm test

Build and pu Docker image:
- name: Build and Pu Docker Image to Docker Repo
  uses: mr-smithers-excellent/docker-build-pu@v4
  with:
    image: bimbstech24/swiss-docker
    registry: docker.io
    username: ${{ secrets.DOCKER_USER }}
    password: ${{ secrets.DOCKER_PASSWORD }}
    dockerfile: Dockerfile

When does the workflow run? The workflow runs automatically:

When there is a push to the main branch.
When a pull request is made to the main branch.

Docker
To build and run the Docker image locally, follow these steps:

Build the Docker image:
docker build -t bimbstech24/swiss-docker .

Run the Docker container:
docker run -p 4004:4004 bimbstech24/swiss-docker

Your server will be running on http://localhost:4004.

