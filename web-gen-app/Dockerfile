# Dockerfile for React Frontend Development with Hot Reload

# Use an official Node.js image as the base for development
FROM node:21

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first, then install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application into the container
COPY . .

# Expose the port the React development server runs on
EXPOSE 3000

# Set environment variable for development mode
ENV CHOKIDAR_USEPOLLING=true

# Start the React app with hot-reloading enabled
CMD ["npm", "start"]
