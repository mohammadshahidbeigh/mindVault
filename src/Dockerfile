# Frontend Dockerfile

# Step 1: Specify the base image
FROM node:18-alpine AS build

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the app for production
RUN npm run build

# Step 7: Serve the app using a lightweight web server like Nginx
FROM nginx:alpine

# Step 8: Copy the build output from the previous step to Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Step 9: Copy custom Nginx config
COPY src/nginx.conf /etc/nginx/conf.d/default.conf

# Step 10: Expose port 80 to access the web app
EXPOSE 80

# Step 11: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
