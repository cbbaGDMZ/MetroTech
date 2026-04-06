import logo from '../assets/logo.png'
import { useUserStore } from '../store/authStore'

const Header = () => {

    const{usuario} = useUserStore()

    return (
        <div
            className="w-full h-16 flex items-center justify-between px-6"
            style={{
                backgroundColor: "rgba(13, 31, 60, 0.45)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                borderBottom: "2px solid rgba(255,255,255,0.15)"
            }}
        >
            {/* Logo */}
            <img
                src={logo}
                alt="MetroTech"
                className="h-10"
                style={{ filter: "brightness(1.7)" }}
            />

            {/* Bienvenida + Avatar */}
            <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm">Bienvenido, {usuario?.user_metadata?.nombre}</span>
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1.5px solid rgba(255,255,255,0.2)"
                    }}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
                        <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Header