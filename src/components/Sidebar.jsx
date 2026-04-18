// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

// Íconos reutilizables
const IconDashboard = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
)
const IconPersonal = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M21 21v-2a4 4 0 0 0-3-3.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)
const IconPlus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)
const IconDoc = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 2v6h6M12 18v-6M9 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)
const IconHistorial = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3.05 11a9 9 0 1 0 .5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3 4v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const IconReporte = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)
const IconEquipo = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)

// Definición de links por rol
const NAV_CONFIG = {
    admin: [
        {
            grupo: 'Principal',
            links: [
                { to: '/admin/dashboard', label: 'Dashboard', icon: <IconDashboard /> },
                { to: '/admin/personal', label: 'Personal', icon: <IconPersonal /> },
            ]
        },
        {
            grupo: 'Mantenimiento',
            links: [
                { to: '/admin/equipos/registrar', label: 'Registrar Equipo', icon: <IconPlus /> },
                { to: '/admin/mantenimiento/nuevo', label: 'Nuevo Mantenimiento', icon: <IconDoc /> },
                { to: '/admin/mantenimiento/historial', label: 'Historial', icon: <IconHistorial /> },
            ]
        },
        {
            grupo: 'Reportes',
            links: [
                { to: '/admin/reportes', label: 'Reportes', icon: <IconReporte /> },
            ]
        },
    ],
    secretaria: [
        {
            grupo: 'Principal',
            links: [
                { to: '/secretaria/dashboard', label: 'Dashboard', icon: <IconDashboard /> },
            ]
        },
        {
            grupo: 'Gestión',
            links: [
                { to: '/secretaria/equipos', label: 'Equipos', icon: <IconEquipo /> },
                { to: '/secretaria/mantenimiento/historial', label: 'Historial', icon: <IconHistorial /> },
            ]
        },
        {
            grupo: 'Reportes',
            links: [
                { to: '/secretaria/reportes', label: 'Reportes', icon: <IconReporte /> },
            ]
        },
    ],
    tecnico: [
        {
            grupo: 'Principal',
            links: [
                { to: '/tecnico/dashboard', label: 'Dashboard', icon: <IconDashboard /> },
            ]
        },
        {
            grupo: 'Mi Trabajo',
            links: [
                { to: '/tecnico/mis-equipos', label: 'Mis Equipos', icon: <IconEquipo /> },
                { to: '/tecnico/mis-reportes', label: 'Mis Reportes', icon: <IconReporte /> },
            ]
        },
    ],
}

const Sidebar = () => {
    const { rol, clearUsuario } = useUserStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        clearUsuario()
        navigate('/')
    }

    const linkClass = ({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
            isActive
                ? 'bg-blue-600/40 text-white'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
        }`

    const grupos = NAV_CONFIG[rol] ?? []

    return (
        <div className="w-full h-full flex flex-col justify-between py-4 px-3">
            <div className="flex flex-col gap-4">
                {grupos.map(({ grupo, links }) => (
                    <div key={grupo}>
                        <p className="text-white/30 text-xs uppercase tracking-widest mb-2 px-3">
                            {grupo}
                        </p>
                        {links.map(({ to, label, icon }) => (
                            <NavLink key={to} to={to} className={linkClass}>
                                {icon}
                                {label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </div>

            <div>
                <div className="border-t border-white/10 mb-3"/>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all w-full cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}

export default Sidebar