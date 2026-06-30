# Punto de Apoyo Frontend

Frontend React + Vite para el backend `punto-de-apoyo`.

## Requisitos

- Node.js 20+
- Backend Spring Boot corriendo en `http://localhost:8080`

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173
```

Vite proxya `/api`, `/uploads` y `/actuator` hacia `http://localhost:8080`, por eso no hace falta configurar CORS para desarrollo local.

## Variables opcionales

Si el backend no esta en `localhost:8080`, crear `.env.local`:

```env
VITE_API_BASE_URL=https://api.puntodeapoyo.org
```


## Estructura del proyecto

```text
src/
  api/              Cliente HTTP, sesion y endpoints por dominio
  components/       Componentes reutilizables sin logica de negocio
  features/         Pantallas y flujos por dominio funcional
  layouts/          Estructuras principales publica/interna
  shared/           Constantes, permisos, formatters y utilidades
  types/            Tipos compartidos de la API
  App.tsx           Orquestador de sesion y vista actual
```

### Convenciones actuales

- `App.tsx` no debe crecer con pantallas nuevas; solo decide si mostrar la experiencia publica o interna.
- Los endpoints nuevos deben agregarse en `src/api/<dominio>Api.ts`.
- Las pantallas nuevas deben vivir dentro de `src/features/<dominio>/`.
- Componentes sin dependencia del backend deben ir en `src/components/`.
- Reglas de permisos por rol deben centralizarse en `src/shared/permissions.ts`.
- Textos de estados, prioridades y fechas deben reutilizar `src/shared/formatters.ts`.

## Funcionalidades incluidas

- Login interno con JWT.
- Registro publico de casos con fotos.
- Consulta publica por codigo y telefono.
- Dashboard interno con filtros por codigo, estado, ciudad, prioridad y fecha.
- Detalle de caso con fotos y asignaciones.
- Asignar y quitar ingenieros.
- Cambiar estado de casos asignados.
- Registrar observaciones tecnicas con fotos.
- Subir evidencia fotografica adicional.
- Descargar PDF de inspeccion.
- Administrar usuarios internos para rol `ADMIN`.
