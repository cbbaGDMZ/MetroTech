**README actualizado:**

---

# MetroTech

Sistema de gestión de mantenimiento para equipos topográficos. Permite registrar equipos, asignar técnicos, gestionar mantenimientos y generar reportes.

## Roles

| Rol | Permisos |
|---|---|
| Admin | CRUD completo de equipos, técnicos y mantenimientos. Genera reportes globales. |
| Técnico | Ve sus equipos asignados y sus propios reportes. Genera reportes de sus trabajos. |
| Secretaria | Solo lectura: equipos, mantenimientos, técnicos y reportes. |

---

## Requisitos previos

- Node.js v18.20.8 (versión recomendada para macOS Big Sur) o v20+ para Windows
- VS Code
- Cuenta en Supabase con el proyecto configurado

Verificar Node.js:
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

Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

Las credenciales se obtienen en Supabase → **Settings → API Keys**. Pídelas al líder del proyecto, nunca se suben a GitHub.

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
| Peticiones y cache | TanStack Query |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Reportes PDF | jsPDF + html2canvas |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Sidebar.jsx        ← Sebas
│   ├── Topbar.jsx         ← Rafa
│   └── Layout.jsx         ← Rafa
├── pages/
│   ├── Login.jsx          ← Diego ✅
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── Tecnicos.jsx
│   │   ├── equipos/
│   │   │   ├── RegistrarEquipo.jsx
│   │   │   └── ListaEquipos.jsx
│   │   ├── mantenimiento/
│   │   │   ├── NuevoServicio.jsx
│   │   │   └── Historial.jsx
│   │   └── Reportes.jsx
│   ├── tecnico/
│   │   ├── Dashboard.jsx
│   │   ├── MisEquipos.jsx
│   │   └── MisReportes.jsx
│   └── secretaria/
│       ├── Dashboard.jsx
│       ├── Equipos.jsx
│       ├── Mantenimientos.jsx
│       └── Reportes.jsx
├── lib/
│   └── supabase.js        ← Diego ✅
├── store/
│   └── authStore.js       ← Diego ✅
└── hooks/
    └── useAuth.js         ← Diego ✅
```

---

## Base de datos

Tablas en Supabase:

- `cliente` — empresas o personas naturales dueñas de equipos
- `empresa` — subtipo de cliente jurídico
- `persona_natural` — subtipo de cliente natural
- `representante` — contacto de una empresa cliente
- `equipo` — equipos topográficos registrados
- `usuario` — usuarios del sistema (admin, técnico, secretaria)
- `tipo_mantenimiento` — catálogo de tipos de mantenimiento
- `asignacion` — asignación de un equipo a un técnico
- `reporte` — registro de trabajos realizados con costo, tiempo, fechas
- `historial_asignacion` — registro de cambios de técnico por equipo

---

## Seguridad

- Autenticación manejada por Supabase Auth con JWT
- Rutas protegidas por rol con `RutaProtegida.jsx`
- Variables de entorno en `.env` (nunca subir a GitHub)
- Protección contra fuerza bruta y SQL injection via Supabase

---

## Equipo

| Desarrollador | Área |
|---|---|
| Diego | Autenticación, rutas protegidas ✅ |
| Sebas | Sidebar ⏳ |
| Rafa | Topbar + Layout ⏳ |

Proyecto desarrollado por el equipo MetroTech — Cochabamba, Bolivia.

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

---

¿Quieres que lo genere como archivo descargable?