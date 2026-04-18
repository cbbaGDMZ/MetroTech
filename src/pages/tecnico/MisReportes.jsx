// src/pages/tecnico/MisReportes.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useUserStore } from '../../store/authStore'

const fetchMisReportes = async (userId) => {
    const { data, error } = await supabase
        .from('reporte')
        .select(`
            id,
            fecha_reporte,
            fecha_inicio,
            fecha_fin,
            tiempo_empleado,
            costo,
            diagnostico,
            observaciones,
            estado,
            tipo_mantenimiento (
                nombre
            ),
            asignacion (
                equipo (
                    codigo_auto,
                    marca,
                    modelo,
                    num_serie,
                    tipo_equipo,
                    cliente (
                        nombre,
                        empresa
                    )
                )
            )
        `)
        .eq('id_tecnico_actual', userId)
        .order('fecha_reporte', { ascending: false })

    if (error) throw error
    return data
}

const cardStyle = {
    backgroundColor: 'rgba(13, 31, 60, 0.45)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
}

const BadgeEstado = ({ estado }) => {
    const config = {
        pendiente:  { bg: 'rgba(234,179,8,0.15)',  color: '#eab308', label: 'Pendiente'  },
        en_curso:   { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'En curso'   },
        completado: { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', label: 'Completado' },
    }
    const c = config[estado] ?? config.pendiente
    return (
        <span className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ backgroundColor: c.bg, color: c.color }}>
            {c.label}
        </span>
    )
}

const IconSearch = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)

const IconEmpty = () => (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 opacity-20">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)

const MisReportes = () => {
    const { usuario } = useUserStore()
    const [busqueda, setBusqueda] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')

    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['mis-reportes', usuario?.id],
        queryFn: () => fetchMisReportes(usuario?.id),
        enabled: !!usuario?.id,
    })

    const filtrados = data.filter(item => {
        const q = busqueda.toLowerCase()
        const equipo = item.asignacion?.equipo
        const matchBusqueda =
            equipo?.codigo_auto?.toLowerCase().includes(q) ||
            equipo?.marca?.toLowerCase().includes(q) ||
            equipo?.modelo?.toLowerCase().includes(q) ||
            equipo?.num_serie?.toLowerCase().includes(q) ||
            equipo?.cliente?.nombre?.toLowerCase().includes(q) ||
            item.diagnostico?.toLowerCase().includes(q)

        const matchEstado = filtroEstado === 'todos' || item.estado === filtroEstado

        return matchBusqueda && matchEstado
    })

    const total      = data.length
    const enCurso    = data.filter(d => d.estado === 'en_curso').length
    const completados = data.filter(d => d.estado === 'completado').length
    const costoTotal = data
        .filter(d => d.costo)
        .reduce((acc, d) => acc + Number(d.costo), 0)

    if (isLoading) return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Cargando reportes...</p>
            </div>
        </div>
    )

    if (isError) return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <p className="text-red-400 text-sm">Error al cargar los reportes.</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-5" style={{ minHeight: 'calc(100vh - 90px)' }}>

            {/* Header */}
            <div style={cardStyle} className="px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Mis Reportes
                        </h1>
                        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {total} reporte{total !== 1 ? 's' : ''} en total
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl text-center"
                            style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                            <p className="text-lg font-bold" style={{ color: '#60a5fa' }}>{enCurso}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>En curso</p>
                        </div>
                        <div className="px-4 py-2 rounded-xl text-center"
                            style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <p className="text-lg font-bold" style={{ color: '#4ade80' }}>{completados}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Completados</p>
                        </div>
                        <div className="px-4 py-2 rounded-xl text-center"
                            style={{ backgroundColor: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                            <p className="text-lg font-bold" style={{ color: '#c084fc' }}>
                                {costoTotal > 0 ? `Bs. ${costoTotal.toLocaleString('es-BO')}` : '—'}
                            </p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Costo total</p>
                        </div>
                    </div>
                </div>

                {/* Buscador + filtro */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            <IconSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por equipo, serie, cliente o diagnóstico..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.8)',
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                        />
                    </div>

                    <div className="flex gap-2">
                        {[
                            { key: 'todos',      label: 'Todos',      color: '#60a5fa', activeBg: 'rgba(37,99,235,0.3)'  },
                            { key: 'en_curso',   label: 'En curso',   color: '#60a5fa', activeBg: 'rgba(59,130,246,0.2)' },
                            { key: 'completado', label: 'Completado', color: '#4ade80', activeBg: 'rgba(34,197,94,0.2)'  },
                        ].map(({ key, label, color, activeBg }) => (
                            <button
                                key={key}
                                onClick={() => setFiltroEstado(key)}
                                className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                                style={{
                                    backgroundColor: filtroEstado === key ? activeBg : 'rgba(255,255,255,0.05)',
                                    color: filtroEstado === key ? color : 'rgba(255,255,255,0.4)',
                                    border: filtroEstado === key
                                        ? `1px solid ${color}40`
                                        : '1px solid rgba(255,255,255,0.06)',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div style={cardStyle} className="overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }}/>
                    <h2 className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Reportes generados
                    </h2>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(168,85,247,0.15)', color: '#c084fc' }}>
                        {filtrados.length}
                    </span>
                </div>

                {filtrados.length === 0 ? (
                    <div className="py-16 text-center">
                        <IconEmpty />
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            No hay reportes registrados
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    {['Equipo', 'N° Serie', 'Cliente', 'Tipo', 'Diagnóstico', 'F. Reporte', 'F. Inicio', 'F. Fin', 'Tiempo', 'Costo', 'Estado'].map(h => (
                                        <th key={h}
                                            className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium"
                                            style={{ color: 'rgba(255,255,255,0.3)' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.map(item => {
                                    const equipo = item.asignacion?.equipo
                                    return (
                                        <tr key={item.id}
                                            className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs px-2 py-1 rounded-md"
                                                        style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>
                                                        {equipo?.codigo_auto ?? '—'}
                                                    </span>
                                                </div>
                                                <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                                    {equipo?.marca} {equipo?.modelo}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {equipo?.num_serie ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
                                                    {equipo?.cliente?.nombre ?? '—'}
                                                </p>
                                                {equipo?.cliente?.empresa && (
                                                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                                        {equipo.cliente.empresa}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                                {item.tipo_mantenimiento?.nombre ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 max-w-[180px]">
                                                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.6)' }}
                                                    title={item.diagnostico}>
                                                    {item.diagnostico ?? '—'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {item.fecha_reporte
                                                    ? new Date(item.fecha_reporte).toLocaleDateString('es-BO')
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {item.fecha_inicio
                                                    ? new Date(item.fecha_inicio).toLocaleDateString('es-BO')
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {item.fecha_fin
                                                    ? new Date(item.fecha_fin).toLocaleDateString('es-BO')
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {item.tiempo_empleado ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-xs font-medium" style={{ color: '#c084fc' }}>
                                                {item.costo ? `Bs. ${Number(item.costo).toLocaleString('es-BO')}` : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <BadgeEstado estado={item.estado} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    )
}

export default MisReportes