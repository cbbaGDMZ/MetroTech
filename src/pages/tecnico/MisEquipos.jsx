// src/pages/tecnico/MisEquipos.jsx
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useUserStore } from '../../store/authStore'

const fetchMisEquipos = async (userId) => {
    const { data, error } = await supabase
        .from('asignacion')
        .select(`
            id,
            fecha_asignacion,
            fecha_estimada,
            estado,
            observaciones,
            tipo_mantenimiento (
                nombre
            ),
            equipo (
                id,
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
        `)
        .eq('id_usuario', userId)
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
        pendiente: { bg: 'rgba(234,179,8,0.15)',   color: '#eab308', label: 'Pendiente' },
        en_curso:  { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', label: 'En curso'  },
        completado:{ bg: 'rgba(34,197,94,0.15)',   color: '#4ade80', label: 'Completado'},
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
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 opacity-20">
        <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
)

import { useState } from 'react'

const MisEquipos = () => {
    const { usuario } = useUserStore()
    const [busqueda, setBusqueda] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')

    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['mis-equipos', usuario?.id],
        queryFn: () => fetchMisEquipos(usuario?.id),
        enabled: !!usuario?.id,
    })

    const filtrados = data.filter(item => {
        const q = busqueda.toLowerCase()
        const matchBusqueda =
            item.equipo?.codigo_auto?.toLowerCase().includes(q) ||
            item.equipo?.marca?.toLowerCase().includes(q) ||
            item.equipo?.modelo?.toLowerCase().includes(q) ||
            item.equipo?.num_serie?.toLowerCase().includes(q) ||
            item.equipo?.cliente?.nombre?.toLowerCase().includes(q)

        const matchEstado = filtroEstado === 'todos' || item.estado === filtroEstado

        return matchBusqueda && matchEstado
    })

    const pendientes  = data.filter(d => d.estado === 'pendiente').length
    const en_curso    = data.filter(d => d.estado === 'en_curso').length
    const completados = data.filter(d => d.estado === 'completado').length

    if (isLoading) return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Cargando equipos...</p>
            </div>
        </div>
    )

    if (isError) return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <p className="text-red-400 text-sm">Error al cargar los equipos.</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-5" style={{ minHeight: 'calc(100vh - 90px)' }}>

            {/* Header */}
            <div style={cardStyle} className="px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Mis Equipos
                        </h1>
                        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {data.length} asignación{data.length !== 1 ? 'es' : ''} en total
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl text-center"
                            style={{ backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                            <p className="text-lg font-bold" style={{ color: '#eab308' }}>{pendientes}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Pendientes</p>
                        </div>
                        <div className="px-4 py-2 rounded-xl text-center"
                            style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                            <p className="text-lg font-bold" style={{ color: '#60a5fa' }}>{en_curso}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>En curso</p>
                        </div>
                        <div className="px-4 py-2 rounded-xl text-center"
                            style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <p className="text-lg font-bold" style={{ color: '#4ade80' }}>{completados}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Completados</p>
                        </div>
                    </div>
                </div>

                {/* Buscador + filtro estado */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            <IconSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por código, equipo, serie o cliente..."
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
                            { key: 'todos',      label: 'Todos',      color: '#60a5fa', activeBg: 'rgba(37,99,235,0.3)'   },
                            { key: 'pendiente',  label: 'Pendiente',  color: '#eab308', activeBg: 'rgba(234,179,8,0.2)'   },
                            { key: 'en_curso',   label: 'En curso',   color: '#60a5fa', activeBg: 'rgba(59,130,246,0.2)'  },
                            { key: 'completado', label: 'Completado', color: '#4ade80', activeBg: 'rgba(34,197,94,0.2)'   },
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
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#60a5fa', boxShadow: '0 0 6px #60a5fa' }}/>
                    <h2 className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Equipos asignados
                    </h2>
                    <span
                        className="ml-auto text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}
                    >
                        {filtrados.length}
                    </span>
                </div>

                {filtrados.length === 0 ? (
                    <div className="py-16 text-center">
                        <IconEmpty />
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            No hay equipos asignados
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    {['Código', 'Equipo', 'N° Serie', 'Tipo', 'Cliente', 'Mantenimiento', 'F. Asignación', 'F. Estimada', 'Estado'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium"
                                            style={{ color: 'rgba(255,255,255,0.3)' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.map((item) => (
                                    <tr key={item.id}
                                        className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs px-2 py-1 rounded-md"
                                                style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>
                                                {item.equipo?.codigo_auto ?? '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                                {item.equipo?.marca} {item.equipo?.modelo}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                                {item.equipo?.tipo_equipo}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                            {item.equipo?.num_serie ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                            {item.equipo?.tipo_equipo ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
                                                {item.equipo?.cliente?.nombre ?? '—'}
                                            </p>
                                            {item.equipo?.cliente?.empresa && (
                                                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                                    {item.equipo.cliente.empresa}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                            {item.tipo_mantenimiento?.nombre ?? '—'}
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
                )}
            </div>

        </div>
    )
}

export default MisEquipos