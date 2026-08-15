# Imagen del frontend. Angular compila a archivos estaticos, asi que la imagen final es
# solo nginx con el resultado: no lleva Node ni las fuentes.

# ---------------------------------------------------------------- construccion
FROM node:22-alpine AS construccion
WORKDIR /construccion

# `npm ci` y no `npm install`: instala exactamente lo del package-lock.json. Un despliegue
# no puede traer una version distinta a la que se probo.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---------------------------------------------------------------- ejecucion
FROM nginx:alpine

COPY --from=construccion /construccion/dist/academia/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD ["sh", "-c", "wget -q --spider http://127.0.0.1/ || exit 1"]
