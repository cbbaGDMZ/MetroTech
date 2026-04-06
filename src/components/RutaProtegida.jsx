import { Navigate } from 'react-router-dom'
import {useUserStore} from '../store/authStore'

const RutaProtegida = ({ rolRequerido, children }) => {
    const { usuario, rol } = useUserStore()

    if (!usuario) return <Navigate to="/" />
    if (rol !== rolRequerido) return <Navigate to="/" />

    return children

}

export default RutaProtegida