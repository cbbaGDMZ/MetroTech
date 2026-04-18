// src/pages/secretaria/mantenimiento/HistorialMantenimiento_Sec.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

const fetchMantenimientos = async () => {
    const { data, error } = await supabase
        .from('asignacion')
        .select(`
            id,
            fecha_asignacion,
            fecha_estimada,
            estado,
            observaciones,
            equipo (
                codigo_auto,
                marca,
                modelo,
                num_serie,
                tipo_equipo
            ),
            usuario (
                nombre,
                apellido
            ),
            tipo_mantenimiento (
                nombre
            )
        `)
        .order('fecha_asignacion', { ascending: false })

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
        pendiente: { bg: 'rgba(234,179,8,0.15)', color: '#eab308', label: 'Pendiente' },
        en_curso:  { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'En curso' },
        completado:{ bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', label: 'Completado' },
    }
    const c = config[estado] ?? config.pendiente
    return (
        <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ backgroundColor: c.bg, color: c.color }}
        >
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
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 opacity-20">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)

const TablaMantenimientos = ({ datos, emptyMsg }) => {
    if (datos.length === 0) {
        return (
            <div className="py-16 text-center">
                <IconEmpty />
                <p className="text-white/30 text-sm">{emptyMsg}</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/5">
                        {['Código', 'Equipo', 'N° Serie', 'Tipo', 'Técnico', 'F. Asignación', 'F. Estimada', 'Estado'].map(h => (
                            <th
                                key={h}
                                className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium"
                                style={{ color: 'rgba(255,255,255,0.3)' }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datos.map((item, i) => (
                        <tr
                            key={item.id}
                            className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]"
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <td className="px-4 py-3">
                                <span
                                    className="font-mono text-xs px-2 py-1 rounded-md"
                                    style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}
                                >
                                    {item.equipo?.codigo_auto ?? '—'}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <p style={{ color: 'rgba(255,255,255,0.9)' }} className="font-medium">
                                    {item.equipo?.marca} {item.equipo?.modelo}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-xs mt-0.5">
                                    {item.equipo?.tipo_equipo}
                                </p>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                {item.equipo?.num_serie ?? '—'}
                            </td>
                            <td className="px-4 py-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                {item.tipo_mantenimiento?.nombre ?? '—'}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                                        style={{ backgroundColor: 'rgba(37,99,235,0.25)', color: '#93c5fd' }}
                                    >
                                        {item.usuario?.nombre?.[0]}{item.usuario?.apellido?.[0]}
                                    </div>
                                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        {item.usuario?.nombre} {item.usuario?.apellido}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                {item.fecha_asignacion
                                    ? new Date(item.fecha_asignacion).toLocaleDateString('es-BO')
                                    : '—'}
                            </td>
                            <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                {item.fecha_estimada
                                    ? new Date(item.fecha_estimada).toLocaleDateString('es-BO')
                                    : '—'}
                            </td>
                            <td className="px-4 py-3">
                                <BadgeEstado estado={item.estado} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const HistorialMantenimiento_Sec = () => {
    const [busqueda, setBusqueda] = useState('')

    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['asignaciones-secretaria'],
        queryFn: fetchMantenimientos,
    })

    const filtrar = (lista) =>
        lista.filter(item => {
            const q = busqueda.toLowerCase()
            return (
                item.equipo?.codigo_auto?.toLowerCase().includes(q) ||
                item.equipo?.marca?.toLowerCase().includes(q) ||
                item.equipo?.modelo?.toLowerCase().includes(q) ||
                item.equipo?.num_serie?.toLowerCase().includes(q) ||
                item.usuario?.nombre?.toLowerCase().includes(q) ||
                item.usuario?.apellido?.toLowerCase().includes(q)
            )
        })

    const pendientes  = filtrar(data.filter(d => d.estado === 'pendiente' || d.estado === 'en_curso'))
    const completados = filtrar(data.filter(d => d.estado === 'completado'))

    if (isLoading) return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Cargando historial...</p>
            </div>
        </div>
    )

    if (isError) return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <p className="text-red-400 text-sm">Error al cargar el historial.</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-5" style={{ minHeight: 'calc(100vh - 90px)' }}>

            {/* Header */}
            <div style={cardStyle} className="px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Historial de Mantenimientos
                        </h1>
                        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {data.length} registro{data.length !== 1 ? 's' : ''} en total
                        </p>
                    </div>

                    {/* Stats rápidas */}
                    <div className="flex items-center gap-3">
                        <div
                            className="px-4 py-2 rounded-xl text-center"
                            style={{ backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}
                        >
                            <p className="text-lg font-bold" style={{ color: '#eab308' }}>{pendientes.length}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Activos</p>
                        </div>
                        <div
                            className="px-4 py-2 rounded-xl text-center"
                            style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                        >
                            <p className="text-lg font-bold" style={{ color: '#4ade80' }}>{completados.length}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Completados</p>
                        </div>
                    </div>
                </div>

                {/* Buscador */}
                <div className="mt-4 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        <IconSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por código, equipo, serie o técnico..."
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
            </div>

            {/* Tabla Pendientes / En curso */}
            <div style={cardStyle} className="overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#eab308', boxShadow: '0 0 6px #eab308' }}
                    />
                    <h2 className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Pendientes y en curso
                    </h2>
                    <span
                        className="ml-auto text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(234,179,8,0.15)', color: '#eab308' }}
                    >
                        {pendientes.length}
                    </span>
                </div>
                <TablaMantenimientos datos={pendientes} emptyMsg="No hay mantenimientos activos" />
            </div>

            {/* Tabla Completados */}
            <div style={cardStyle} className="overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#4ade80', boxShadow: '0 0 6px #4ade80' }}
                    />
                    <h2 className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Completados
                    </h2>
                    <span
                        className="ml-auto text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80' }}
                    >
                        {completados.length}
                    </span>
                </div>
                <TablaMantenimientos datos={completados} emptyMsg="No hay mantenimientos completados aún" />
            </div>

        </div>
    )
}

export default HistorialMantenimiento_Sec