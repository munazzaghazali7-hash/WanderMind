# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Declare build argument (passed via --build-arg or Cloud Build substitution)
ARG VITE_GEMINI_API_KEY
# Expose it as an ENV var so Vite can read it at build time
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Copy package files
COPY package*.json ./

# Install dependencies (npm install is more tolerant of minor lock file diffs)
RUN npm install --frozen-lockfile 2>/dev/null || npm install

# Copy source code
COPY . .

# Build the app (Vite bakes VITE_* env vars into the JS bundle here)
RUN npm run build

# Production stage using Nginx
FROM nginx:alpine

# Copy the built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx config
# Cloud Run requires listening on port 8080 by default
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
