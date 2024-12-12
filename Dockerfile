# Use the official Node.js image as the base image
FROM node:20

# Create and change to the app directory
WORKDIR /

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Run the frontend command
RUN node src/front.js
