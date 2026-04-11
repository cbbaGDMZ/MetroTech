import { Navigate } from 'react-router-dom'
import { useUserStore } from '../store/authStore'

const RutaProtegida = ({ rolRequerido, children }) => {
    const { usuario, rol, loading } = useUserStore()

    if (loading) return null

    if (!usuario) return <Navigate to="/" />
    if (rol !== rolRequerido) return <Navigate to="/" />
    return children
}

export default RutaProtegida