# Build Angular
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Ajusta si tu script es "build": "ng build"
RUN npm run build -- --configuration=production

# Servir con Nginx
FROM nginx:alpine
COPY /deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
# Ajusta NOMBRE_APP (carpeta que Angular creó en dist)
COPY --from=build /app/dist/front_proyecto2/browser /usr/share/nginx/html
EXPOSE 80
