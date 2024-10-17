# Backend Dockerfile

# Step 1: Specify the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, and tsconfig.json
COPY package*.json tsconfig.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY src ./src

# Step 7: Build the TypeScript code
RUN npm run build

# Step 9: Expose the port your app runs on
EXPOSE 4000

# Step 10: Command to run the application
CMD ["node", "dist/server.js"]
