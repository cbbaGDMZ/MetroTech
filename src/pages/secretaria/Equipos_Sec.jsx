// src/pages/secretaria/Equipos_Sec.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

const fetchEquipos = async () => {
    const { data, error } = await supabase
        .from('equipo')
        .select(`
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
        `)
        .order('id', { ascending: false })

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

// Ícono y color según tipo de equipo
const getTipoConfig = (tipo) => {
    const t = tipo?.toLowerCase() ?? ''
    if (t.includes('nivel') || t.includes('nivel'))
        return { color: '#60a5fa', bg: 'rgba(37,99,235,0.15)', label: tipo }
    if (t.includes('estacion') || t.includes('estación') || t.includes('total'))
        return { color: '#a78bfa', bg: 'rgba(139,92,246,0.15)', label: tipo }
    if (t.includes('gps') || t.includes('gnss'))
        return { color: '#34d399', bg: 'rgba(16,185,129,0.15)', label: tipo }
    if (t.includes('drone') || t.includes('dron'))
        return { color: '#fb923c', bg: 'rgba(249,115,22,0.15)', label: tipo }
    if (t.includes('teodolito'))
        return { color: '#f472b6', bg: 'rgba(236,72,153,0.15)', label: tipo }
    return { color: '#94a3b8', bg: 'rgba(148,163,184,0.10)', label: tipo ?? 'Equipo' }
}

const IconEquipo = ({ tipo }) => {
    const t = tipo?.toLowerCase() ?? ''

    if (t.includes('gps') || t.includes('gnss')) return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    )

    if (t.includes('drone') || t.includes('dron')) return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 5h2a2 2 0 0 1 2 2v1H5V5zM19 5h-2a2 2 0 0 0-2 2v1h4V5zM5 19h2a2 2 0 0 0 2-2v-1H5v3zM19 19h-2a2 2 0 0 1-2-2v-1h4v3z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 12H5M19 12h-4M12 9V5M12 19v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    )

    // Default: instrumento topográfico genérico
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L8 6h8l-4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <rect x="9" y="6" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 14h10M12 14v6M9 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
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

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-start gap-2">
        <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
        <span className="text-xs text-right font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {value ?? '—'}
        </span>
    </div>
)

const EquipoCard = ({ equipo }) => {
    const { color, bg } = getTipoConfig(equipo.tipo_equipo)
    const clienteNombre = equipo.cliente?.nombre ?? '—'
    const clienteEmpresa = equipo.cliente?.empresa

    return (
        <div
            className="flex flex-col gap-4 p-5 transition-all duration-200 hover:scale-[1.01]"
            style={{
                ...cardStyle,
                border: '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${color}35`}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
        >
            {/* Top: ícono + código */}
            <div className="flex items-start justify-between gap-3">
                <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: bg, color }}
                >
                    <IconEquipo tipo={equipo.tipo_equipo} />
                </div>

                <div className="flex-1 min-w-0">
                    <p
                        className="font-mono text-xs px-2 py-1 rounded-md inline-block mb-1"
                        style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}
                    >
                        {equipo.codigo_auto}
                    </p>
                    <p
                        className="font-semibold text-sm leading-tight truncate"
                        style={{ color: 'rgba(255,255,255,0.92)' }}
                    >
                        {equipo.marca} {equipo.modelo}
                    </p>
                    <p
                        className="text-xs mt-0.5 truncate"
                        style={{ color }}
                    >
                        {equipo.tipo_equipo ?? '—'}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

            {/* Info */}
            <div className="flex flex-col gap-2">
                <InfoRow label="N° Serie" value={equipo.num_serie} />
                <InfoRow label="Cliente" value={clienteNombre} />
                {clienteEmpresa && (
                    <InfoRow label="Empresa" value={clienteEmpresa} />
                )}
            </div>

            {/* Footer: cliente avatar */}
            <div
                className="flex items-center gap-2 pt-1 mt-auto"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
                <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: `${color}25`, color }}
                >
                    {clienteNombre?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {clienteEmpresa ? `${clienteNombre} · ${clienteEmpresa}` : clienteNombre}
                </span>
            </div>
        </div>
    )
}

const Equipos_Sec = () => {
    const [busqueda, setBusqueda] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('todos')

    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['equipos-secretaria'],
        queryFn: fetchEquipos,
    })

    // Tipos únicos para el filtro
    const tiposUnicos = ['todos', ...new Set(data.map(e => e.tipo_equipo).filter(Boolean))]

    const equiposFiltrados = data.filter(e => {
        const q = busqueda.toLowerCase()
        const matchBusqueda =
            e.codigo_auto?.toLowerCase().includes(q) ||
            e.marca?.toLowerCase().includes(q) ||
            e.modelo?.toLowerCase().includes(q) ||
            e.num_serie?.toLowerCase().includes(q) ||
            e.cliente?.nombre?.toLowerCase().includes(q) ||
            e.cliente?.empresa?.toLowerCase().includes(q)

        const matchTipo = filtroTipo === 'todos' || e.tipo_equipo === filtroTipo

        return matchBusqueda && matchTipo
    })

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
                            Equipos
                        </h1>
                        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {equiposFiltrados.length} de {data.length} equipo{data.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                        {tiposUnicos.filter(t => t !== 'todos').map(tipo => {
                            const { color, bg } = getTipoConfig(tipo)
                            const count = data.filter(e => e.tipo_equipo === tipo).length
                            return (
                                <div
                                    key={tipo}
                                    className="px-3 py-2 rounded-xl text-center hidden sm:block"
                                    style={{ backgroundColor: bg, border: `1px solid ${color}30` }}
                                >
                                    <p className="text-base font-bold" style={{ color }}>{count}</p>
                                    <p className="text-xs truncate max-w-[80px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                        {tipo}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Buscador + filtros */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            <IconSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por código, marca, serie o cliente..."
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

                    {/* Filtro tipo */}
                    <div className="flex gap-2 flex-wrap">
                        {tiposUnicos.map(tipo => {
                            const { color } = getTipoConfig(tipo)
                            const activo = filtroTipo === tipo
                            return (
                                <button
                                    key={tipo}
                                    onClick={() => setFiltroTipo(tipo)}
                                    className="px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize"
                                    style={{
                                        backgroundColor: activo
                                            ? tipo === 'todos' ? 'rgba(37,99,235,0.3)' : `${color}25`
                                            : 'rgba(255,255,255,0.05)',
                                        color: activo
                                            ? tipo === 'todos' ? '#60a5fa' : color
                                            : 'rgba(255,255,255,0.4)',
                                        border: activo
                                            ? `1px solid ${tipo === 'todos' ? 'rgba(37,99,235,0.4)' : `${color}40`}`
                                            : '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    {tipo === 'todos' ? 'Todos' : tipo}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Grid de cards */}
            {equiposFiltrados.length === 0 ? (
                <div style={cardStyle} className="py-20 text-center">
                    <IconEmpty />
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        No se encontraron equipos
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {equiposFiltrados.map(equipo => (
                        <EquipoCard key={equipo.id} equipo={equipo} />
                    ))}
                </div>
            )}

        </div>
    )
}

export default Equipos_Sec