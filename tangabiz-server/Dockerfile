# SELECT the image
FROM oven/bun:latest

# Install OpenSSL (for Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package and bun files
COPY package.json bun.lock ./

# Install files
RUN bun install

# Copy all of the source code
COPY . .

# After copying code and installing dependencies
RUN bunx prisma generate

# Expo port
EXPOSE 8080

# Start the app
CMD ["bun", "start"]