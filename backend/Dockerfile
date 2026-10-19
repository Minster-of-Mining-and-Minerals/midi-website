FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for native modules (like bcrypt)
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies (using the lockfile for speed)
RUN npm install

# Copy the rest of the application code
COPY . .

# Set permissions for uploads (if needed)
RUN mkdir -p uploads && chmod -R 777 uploads

# Expose the backend API (4000) and Socket.IO (5000) ports
EXPOSE 4000 5000

# Make entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

# Start command via entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]
