# Step 1: Build the React application using Vite
# Use a specific version of Node
FROM node:17.7 as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock file
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
RUN yarn run build

# Step 2: Serve the application using a lightweight server like Nginx
FROM nginx:stable-alpine as production-stage

# Copy nginx configuration
# You could add a custom nginx.conf if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Copy your custom nginx.conf to the container
COPY default.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to replace the default nginx contents.
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]