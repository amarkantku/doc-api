# Use the official Node.js image
FROM node:18

# Create and set the working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port
EXPOSE 3001

# Run the application
CMD ["node", "src/index.js"]
