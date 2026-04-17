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
import Dashboard_Sec from './pages/secretaria/Dashboard_Sec'
import Equipos_Sec from './pages/secretaria/Equipos_Sec'
import Reportes_Sec from './pages/secretaria/Reportes_Sec'
import HistorialMantenimiento_Sec from './pages/secretaria/mantenimiento/HistorialMantenimiento_Sec'
import Dashboard_Tec from './pages/tecnico/Dashboard_Tec'
import MisEquipos from './pages/tecnico/MisEquipos'
import MisReportes_Sec from './pages/tecnico/MisReportes'

function App() {
    useAuth()
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            {/* Admin */}
            <Route element={<RutaProtegida rolRequerido="admin"><Layout /></RutaProtegida>}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/personal" element={<Personal />} />
                <Route path="/admin/reportes" element={<Reportes />} />
                <Route path="/admin/equipos/registrar" element={<RegistrarEquipo />} />
                <Route path="/admin/mantenimiento/nuevo" element={<NuevoMantenimiento />} />
                <Route path="/admin/mantenimiento/historial" element={<HistorialMantenimiento />} />
                <Route path="/admin/equipos/formulario" element={<FormularioEquipo />} />
            </Route>

            {/* Secretaria */}
            <Route element={<RutaProtegida rolRequerido="secretaria"><Layout /></RutaProtegida>}>
                <Route path="/secretaria/dashboard" element={<Dashboard_Sec />} />
                <Route path="/secretaria/equipos" element={<Equipos_Sec />} />
                <Route path="/secretaria/reportes" element={<Reportes_Sec />} />
                <Route path="/secretaria/mantenimiento/historial" element={<HistorialMantenimiento_Sec />} />
            </Route>

            {/* Técnico */}
            <Route element={<RutaProtegida rolRequerido="tecnico"><Layout /></RutaProtegida>}>
                <Route path="/tecnico/dashboard" element={<Dashboard_Tec />} />
                <Route path="/tecnico/mis-equipos" element={<MisEquipos />} />
                <Route path="/tecnico/mis-reportes" element={<MisReportes_Sec />} />
            </Route>

        </Routes>
    )
}
export default App