
# Multi-stage build for a React application
# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the source code
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV PUBLIC_URL=/
ENV VITE_BASE_URL=/

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
