# ---------- Stage 1: Build ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build
    
    # ---------- Stage 2: Production ----------
    FROM node:20-alpine
    
    WORKDIR /app
    
    # Only copy dist + dependencies
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package*.json ./
    RUN npm install --production
    
    EXPOSE 3001
    CMD ["node", "dist/server.js"]
    