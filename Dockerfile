FROM node:25-alpine
WORKDIR /app
COPY . .
RUN npm install --omit=dev
CMD ["node", "src/server.js"]
EXPOSE 8080