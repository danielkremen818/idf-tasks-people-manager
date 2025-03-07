
# Multi-stage build for a React application
# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Install global dependencies
RUN apk add --no-cache git

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the source code
COPY . .

# Debug build environment
RUN echo "Building application..." && \
    echo "NODE_ENV: $NODE_ENV" && \
    echo "HOSTNAME: $(hostname)" && \
    echo "PWD: $(pwd)" && \
    echo "Files in directory:" && \
    ls -la

# Set environment variables for build
ENV NODE_ENV=production
ENV PUBLIC_URL=/
ENV VITE_BASE_URL=/
ENV VITE_API_URL=/api

# Build the application
RUN npm run build && \
    echo "Build complete. Files in dist:" && \
    ls -la dist

# Stage 2: Serve the application
FROM nginx:alpine

# Add necessary utilities and dependencies
RUN apk add --no-cache curl postgresql-client su-exec && \
    rm -rf /etc/nginx/conf.d/*

# Copy the built application from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a simple health check page
RUN echo "OK" > /usr/share/nginx/html/health

# Create startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create military texture background
RUN mkdir -p /usr/share/nginx/html/assets
COPY public/military-texture.jpg /usr/share/nginx/html/

# Create version info file
RUN echo "Build date: $(date)" > /usr/share/nginx/html/version.txt

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/health || exit 1

# Use the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
