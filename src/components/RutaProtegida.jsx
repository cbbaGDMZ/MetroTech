import { Navigate } from 'react-router-dom'
import { useUserStore } from '../store/authStore'

const RutaProtegida = ({ rolRequerido, children }) => {
    const { usuario, rol, loading } = useUserStore()

    console.log('RutaProtegida:', { rolRequerido, usuario: !!usuario, rol, loading })

    if (loading) return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a1628',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '14px'
        }}>
            Cargando...
        </div>
    )

    if (!usuario) return <Navigate to="/" />
    if (rol !== rolRequerido) return <Navigate to="/" />
    return children
}

export default RutaProtegida