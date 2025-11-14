# Proyecto de Facturacion (Node + MySQL + Astro)

Este repositorio contiene un backend construido con Node.js, Express y MySQL y un frontend en Astro listo para iniciar un sistema de facturacion. Todo esta preparado para ejecutarse en contenedores mediante Docker Compose para que puedas levantarlo rapidamente en cualquier maquina y subirlo sin problemas a tu cuenta de GitHub.

## Requisitos previos
- Docker y Docker Compose actualizados
- Node.js 20+ y npm si deseas desarrollar sin contenedores
- Una cuenta de GitHub para versionar y publicar el codigo

## Estructura

```text
.
├── backend/        # API REST (Express + JWT + MySQL)
├── frontend/       # Aplicacion Astro + TailwindCSS
├── docker-compose.yml
└── README.md
```

## Primeros pasos

1. Copia los archivos de variables de entorno:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Ajusta los valores (puertos, credenciales de MySQL, JWT_SECRET, etc.).
3. Construye e inicia los contenedores:

```bash
docker compose up --build
```

El backend quedara disponible en `http://localhost:3800/api` y el frontend en `http://localhost:4920`. Si necesitas acceder a MySQL desde fuera de Docker usa `localhost:33306`.

## Backend

- Express + MySQL (`mysql2`) con autenticacion JWT y validaciones usando Zod.
- Rutas listas: autenticacion (`/api/auth`), clientes (`/api/customers`) y facturas (`/api/invoices`).
- Middleware de seguridad: Helmet, CORS abierto para desarrollo y limitador de peticiones.
- Seed opcional: define `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `ADMIN_NAME` para generar un usuario administrador automaticamente.

## Frontend

- Astro + TailwindCSS con un dashboard inicial de facturacion.
- Formularios para crear clientes/facturas mediante fetch hacia el backend y resumen de ingresos recientes.
- Configura `PUBLIC_API_BASE` y `PUBLIC_API_TOKEN` (si ya generaste un token JWT) para consumir la API protegida.

## Variables clave

| Archivo | Variables |
| --- | --- |
| `backend/.env` | `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` |
| `frontend/.env` | `PUBLIC_API_BASE`, `PUBLIC_API_TOKEN` |

## Flujo sugerido

1. `docker compose up --build`
2. Crear un usuario (`POST /api/auth/register`) o usar el admin definido en variables.
3. Iniciar sesion (`POST /api/auth/login`) y copiar el token.
4. Guardar el token en `frontend/.env` (`PUBLIC_API_TOKEN`) o pegarlo desde el formulario del frontend para almacenarlo en `localStorage`.
5. Gestionar clientes y facturas desde la UI o directamente contra la API.

## Publicar en GitHub

```bash
git init
git add .
git commit -m "Proyecto base de facturacion"
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main
```

## Scripts utiles

- `npm run dev` dentro de `backend/` inicia el API con Nodemon.
- `npm run start` dentro de `frontend/` levanta Astro en modo desarrollo.
- `docker compose down` detiene los servicios cuando termines.
