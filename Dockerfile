# Etapa de build Angular
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Etapa de runtime con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/front_proyecto2/browser /usr/share/nginx/html
EXPOSE 80
