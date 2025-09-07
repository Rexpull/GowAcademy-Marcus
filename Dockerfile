FROM node:20-alpine

# Install OpenSSL for Prisma compatibility
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application (with environment variables)
ARG DATABASE_URL
ARG BRASILAPI_BASE_URL
ARG BRASILAPI_CEP_PATH
ARG BRASILAPI_CDI_PATH
ARG REQUEST_TIMEOUT_MS
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV DATABASE_URL=$DATABASE_URL
ENV BRASILAPI_BASE_URL=$BRASILAPI_BASE_URL
ENV BRASILAPI_CEP_PATH=$BRASILAPI_CEP_PATH
ENV BRASILAPI_CDI_PATH=$BRASILAPI_CDI_PATH
ENV REQUEST_TIMEOUT_MS=$REQUEST_TIMEOUT_MS
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

RUN npm run build

# Verify build files exist
RUN ls -la .next/

# Expose port
EXPOSE 3005

# Start the application
CMD ["npm", "start"]
