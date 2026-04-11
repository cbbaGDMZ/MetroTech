# MetroTech

Sistema de gestión de mantenimiento para equipos topográficos. Permite registrar equipos, asignar técnicos, gestionar mantenimientos y generar reportes.

## Roles

| Rol | Permisos |
|---|---|
| Admin | Acceso total: equipos, personal, mantenimientos, historial, reportes |
| Técnico | Ve sus equipos asignados y sus propios reportes |
| Secretaria | Solo lectura de todo |

---

## Requisitos previos

- Node.js v18.20.8 (recomendado para macOS Big Sur) o v20+ para Windows
- VS Code
- Cuenta en Supabase con el proyecto configurado

```bash
node -v
npm -v
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/cbbaGDMZ/MetroTech.git
cd MetroTech
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_SUPABASE_SERVICE_KEY=tu-service-role-key
```

Las credenciales se obtienen en Supabase → Settings → API Keys. Nunca subir al repositorio.

### 4. Levantar el proyecto

```bash
npm run dev
```

Abre http://localhost:5173 en el navegador.

---

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | React + Vite |
| Estilos | Tailwind CSS v3 |
| Routing | React Router v6 |
| Formularios | React Hook Form + Zod |
| Estado global | Zustand |
| Peticiones y cache | TanStack Query v5 |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Gráficas | Recharts |
| Reportes PDF | jsPDF + html2canvas |

---

## Estructura del proyecto

```
src/
├── assets/
│   └── logo.png
├── components/
│   ├── Header.jsx
│   ├── Layout.jsx
│   ├── RutaProtegida.jsx
│   └── Sidebar.jsx
├── hooks/
│   └── useAuth.js
├── lib/
│   └── supabase.js
├── pages/
│   ├── Login.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── Personal.jsx
│   │   ├── Reportes.jsx
│   │   ├── RegistrarEquipo.jsx
│   │   ├── equipos/
│   │   │   └── FormularioEquipo.jsx
│   │   └── mantenimiento/
│   │       ├── NuevoMantenimiento.jsx
│   │       └── HistorialMantenimiento.jsx
│   ├── secretaria/
│   └── tecnico/
├── store/
│   └── authStore.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## Base de datos

Tablas en Supabase:

- `cliente` — empresas o personas naturales dueñas de equipos
- `empresa` — subtipo de cliente jurídico
- `persona_natural` — subtipo de cliente natural
- `representante` — contacto de una empresa cliente
- `equipo` — equipos topográficos registrados
- `usuario` — usuarios del sistema con rol y estado
- `tipo_mantenimiento` — catálogo de tipos de mantenimiento
- `asignacion` — asignación de equipo a técnico con estado y observaciones
- `reporte` — registro de trabajos con costo, tiempo y fechas
- `historial_asignacion` — registro de cambios de técnico por equipo

### Notas importantes sobre la base de datos

- `usuario.id` es de tipo `uuid` para coincidir con Supabase Auth
- `asignacion.estado` acepta solo: `pendiente`, `en_curso`, `completado`
- `asignacion` tiene columna `id_tipo_mantenimiento` y `observaciones` agregadas posteriormente
- RLS deshabilitado en tablas principales para uso interno

---

## Autenticación

Supabase Auth con email y contraseña. El rol se guarda en `user_metadata`. Para crear o actualizar el rol de un usuario desde SQL Editor:

```sql
update auth.users
set raw_user_meta_data = '{"rol": "admin", "nombre": "Diego"}'
where email = 'admin@metrotech.com';
```

La creación de usuarios desde el sistema usa `supabaseAdmin` con la service role key para evitar cerrar la sesión del admin activo.

---

## Fases completadas

- Fase 1 — Configuración del proyecto y dependencias
- Fase 2 — Autenticación con Supabase Auth y rutas protegidas por rol
- Fase 3 — Layout base con Header, Sidebar y Outlet
- Fase 4 — Módulo Equipos: registro y formulario de 3 pasos
- Fase 5 — Módulo Personal: tabla de usuarios y creación con modal
- Fase 6 — Módulo Mantenimientos: nuevo mantenimiento e historial con filtros
- Fase 7 — Dashboard con estadísticas, lista de técnicos y gráfica de 30 días
- Fase 8 — Reportes PDF con jsPDF + html2canvas


## Fases pendientes

- Fase 9 — Vistas del técnico: equipos asignados y reportes propios
- Fase 10 — Vistas de secretaria: solo lectura

---

## Seguridad

- Autenticación manejada por Supabase Auth con JWT
- Rutas protegidas por rol con `RutaProtegida.jsx`
- Estado de carga (`loading`) para evitar redirecciones prematuras al refrescar
- Variables de entorno en `.env` — nunca subir a GitHub
- Service role key solo usada en cliente admin, nunca expuesta en rutas públicas

---

## Equipo

| Desarrollador | Área |
|---|---|
| Diego | Líder técnico — arquitectura, auth, módulos admin |

Proyecto desarrollado por el equipo Dich para  MetroTech — Cochabamba, Bolivia.

---

## Extensiones recomendadas para VS Code

- ES7+ React/Redux Snippets
- Tailwind CSS IntelliSense
- Prettier
- GitLens
- PostCSS Language Support

---

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Previsualizar build
```