import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import RutaProtegida from './components/RutaProtegida'
import useAuth from './hooks/useAuth'
import Dashboard from './pages/admin/Dashboard'
import Personal from './pages/admin/Personal'
import Reportes from './pages/admin/Reportes'
import NuevoMantenimiento from './pages/admin/mantenimiento/NuevoMantenimiento'
import RegistrarEquipo from './pages/admin/RegistrarEquipo'
import HistorialMantenimiento from './pages/admin/mantenimiento/HIstorialMantenimiento'
import Layout from './components/Layout'
import FormularioEquipo from './pages/admin/equipos/FormularioEquipo'

function App() {
    useAuth()
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={
                <RutaProtegida rolRequerido="admin">
                    <Layout />
                </RutaProtegida>
            }>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/personal" element={<Personal />} />
                <Route path="/admin/reportes" element={<Reportes />} />
                <Route path="/admin/equipos/registrar" element={<RegistrarEquipo />} />
                <Route path="/admin/mantenimiento/nuevo" element={<NuevoMantenimiento />} />
                <Route path="/admin/mantenimiento/historial" element={<HistorialMantenimiento />} />
                <Route path="/admin/equipos/formulario" element={<FormularioEquipo />} />
            </Route>
        </Routes>
    )
}
export default App