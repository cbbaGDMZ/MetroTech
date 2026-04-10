import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery} from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

const RegistrarEquipo = () => {
    const navigate = useNavigate()
    const [busqueda, setBusqueda] = useState('')

    const { data : equipos = [] , isLoading } = useQuery({
        queryKey:['equipos'],
        queryFn: async () => {
            const {data, error}=await supabase
                .from('equipo')
                .select(`
                    id,
                    marca,
                    modelo,
                    num_serie,
                    tipo_equipo,
                    cliente(nombre)
                `)
            if (error) throw error
            return data
        }
    })

    const equiposFiltrados = equipos.filter(e =>
        e.cliente?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.num_serie?.toLowerCase().includes(busqueda.toLowerCase())
    )

    if (isLoading) return <div className="text-white/50 p-6">Cargando equipos...</div>

    return (
        <div className="w-full min-h-full p-6"
            style={{
                backgroundColor: "rgba(13, 31, 60, 0.65)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
            }}
        >
            <h1 className="text-white/90 text-lg font-semibold mb-6">Equipos</h1>

            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Registrar nuevo equipo</p>
            <div
                onClick={() => navigate('/admin/equipos/formulario')}
                className="w-48 h-36 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl border border-dashed border-white/20 hover:border-blue-400/60 hover:bg-blue-600/10 transition-all mb-8"
            >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                </div>
                <span className="text-white/50 text-sm">Nuevo Equipo</span>
            </div>

            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Equipos registrados</p>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 w-64"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                    <path d="M16.5 16.5l4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                    type="text"
                    placeholder="Buscar equipo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="bg-transparent text-sm text-white/70 placeholder-white/25 outline-none w-full"
                />
            </div>

            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                            <th className="text-left px-4 py-3 text-white/40 font-medium">Cliente</th>
                            <th className="text-left px-4 py-3 text-white/40 font-medium">Marca</th>
                            <th className="text-left px-4 py-3 text-white/40 font-medium">Modelo</th>
                            <th className="text-left px-4 py-3 text-white/40 font-medium">N° Serie</th>
                            <th className="text-left px-4 py-3 text-white/40 font-medium">Tipo</th>
                            <th className="text-left px-4 py-3 text-white/40 font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equiposFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-white/30">No se encontraron equipos</td>
                            </tr>
                        ) : (
                            equiposFiltrados.map((equipo, index) => (
                                <tr key={equipo.id}
                                    style={{ borderBottom: index < equiposFiltrados.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                                    className="hover:bg-white/3 transition-all"
                                >
                                    <td className="px-4 py-3 text-white/70">{equipo.cliente?.nombre}</td>
                                    <td className="px-4 py-3 text-white/70">{equipo.marca}</td>
                                    <td className="px-4 py-3 text-white/70">{equipo.modelo}</td>
                                    <td className="px-4 py-3 text-white/70">{equipo.num_serie}</td>

                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded-md text-xs"
                                            style={{ background: "rgba(59,130,246,0.15)", color: "rgba(147,197,253,0.9)" }}
                                        >
                                            {equipo.tipo_equipo}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="text-white/30 hover:text-white/70 transition-all text-xs">Nuevo Mantenimiento</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RegistrarEquipo