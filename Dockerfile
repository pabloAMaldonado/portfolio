# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build application (Angular build creates dist folder)
RUN npm run build --prod

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image using nginx
FROM nginx:alpine as final

# Copy the dist folder from the build stage into nginx's default public directory
COPY --from=build /app/dist/web-pm/browser /usr/share/nginx/html

# Expose port 80 for the app (default for HTTP)
EXPOSE 80

# Start the nginx server (keep it running in the foreground)
CMD ["nginx", "-g", "daemon off;"]