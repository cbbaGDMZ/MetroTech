import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const { clearUsuario } = useUserStore()
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

    return (
        <div
            className="w-full h-full flex flex-col justify-between py-4 px-3"
            style={{
                backgroundColor: "rgba(13, 31, 60, 0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
            }}
        >
            <div className="flex flex-col gap-4">

                {/* Principal */}
                <div>
                    <p className="text-white/30 text-xs uppercase tracking-widest mb-2 px-3">Principal</p>
                    <NavLink to="/admin/dashboard" className={linkClass}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/personal" className={linkClass}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M21 21v-2a4 4 0 0 0-3-3.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Personal
                    </NavLink>
                </div>

                {/* Mantenimiento */}
                <div>
                    <p className="text-white/30 text-xs uppercase tracking-widest mb-2 px-3">Mantenimiento</p>
                    <NavLink to="/admin/equipos/registrar" className={linkClass}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Registrar Equipo
                    </NavLink>
                    <NavLink to="/admin/mantenimiento/nuevo" className={linkClass}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M14 2v6h6M12 18v-6M9 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Nuevo Mantenimiento
                    </NavLink>
                    <NavLink to="/admin/mantenimiento/historial" className={linkClass}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M3.05 11a9 9 0 1 0 .5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M3 4v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Historial
                    </NavLink>
                </div>

                {/* Reportes */}
                <div>
                    <p className="text-white/30 text-xs uppercase tracking-widest mb-2 px-3">Reportes</p>
                    <NavLink to="/admin/reportes" className={linkClass}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Reportes
                    </NavLink>
                </div>

            </div>

            {/* Cerrar Sesión */}
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