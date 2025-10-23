FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Set environment
ENV NODE_ENV=production
EXPOSE 5000

# Start the app
CMD ["node", "dist/index.js"]