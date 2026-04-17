import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'

export default function HistorialMantenimiento() {
    const [filtroEquipo, setFiltroEquipo] = useState('')
    const [filtroFecha, setFiltroFecha] = useState('')
    const [filtroSerie, setFiltroSerie] = useState('')
    const queryClient = useQueryClient()
    const [filtroCliente, setFiltroCliente] = useState('')

    const { data: asignaciones = [], isLoading } = useQuery({
        queryKey: ['asignaciones_historial'],
        queryFn: async () => {
                const { data, error } = await supabase
                    .from('asignacion')
                    .select(`
                        id, estado, fecha_asignacion, fecha_estimada,
                        equipo(id, marca, modelo, num_serie, cliente(nombre)),
                        usuario:id_usuario(nombre, apellido),
                        tipo_mantenimiento:id_tipo_mantenimiento(nombre)
                    `)
                    .order('fecha_asignacion', { ascending: false })
            if (error) throw error
            return data
        }
    })

    const completar = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('asignacion')
                .update({
                    estado: 'completado',
                    fecha_estimada: new Date().toISOString(),
                })
                .eq('id', id)
            if (error) throw error
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['asignaciones_historial'] }),
    })

    const enCurso = asignaciones.filter(a => a.estado === 'pendiente' || a.estado === 'en_curso')

    const completados = asignaciones.filter(a => {
        if (a.estado !== 'completado') return false
        const equipo = a.equipo
        if (filtroCliente && !equipo?.cliente?.nombre?.toLowerCase().includes(filtroCliente.toLowerCase())) return false
        if (filtroEquipo && !`${equipo?.marca} ${equipo?.modelo}`.toLowerCase().includes(filtroEquipo.toLowerCase())) return false
        if (filtroSerie && !equipo?.num_serie?.toLowerCase().includes(filtroSerie.toLowerCase())) return false
        if (filtroFecha && !a.fecha_asignacion?.startsWith(filtroFecha)) return false
        return true
    })

    const cardStyle = {
        background: 'rgba(13,31,60,0.45)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
    }

    const inputStyle = {
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '8px',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '13px',
        outline: 'none',
    }

    const estadoStyle = (estado) => {
        if (estado === 'en_curso') return { bg: 'rgba(37,99,235,0.15)', color: '#60a5fa', border: 'rgba(37,99,235,0.3)', label: 'En curso' }
        if (estado === 'pendiente') return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)', label: 'Pendiente' }
        return { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)', label: 'Completado' }
    }

    const thStyle = {
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '11px',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    }

    const tdStyle = {
        padding: '12px 16px',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.7)',
    }

    const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

    const FilaTabla = ({ a, mostrarBoton }) => {
        const ec = estadoStyle(a.estado)
        return (
            <tr
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <td style={tdStyle}>
                    <div style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{a.equipo?.marca} {a.equipo?.modelo}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>S/N: {a.equipo?.num_serie || '—'}</div>
                </td>
                <td style={tdStyle}>{a.equipo?.cliente?.nombre || '—'}</td>
                <td style={tdStyle}>{a.usuario?.nombre} {a.usuario?.apellido}</td>
                <td style={tdStyle}>{a.tipo_mantenimiento?.nombre || '—'}</td>
                <td style={tdStyle}>{formatFecha(a.fecha_asignacion)}</td>
                <td style={tdStyle}>{formatFecha(a.fecha_estimada)}</td>
                
                {mostrarBoton && (
                    <td style={tdStyle}>
                        <button
                            onClick={() => completar.mutate(a.id)}
                            disabled={completar.isPending}
                            style={{
                                padding: '6px 14px',
                                background: 'rgba(16,185,129,0.15)',
                                border: '1px solid rgba(16,185,129,0.3)',
                                borderRadius: '6px',
                                color: '#34d399',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: 500,
                            }}
                        >
                            Completar
                        </button>
                    </td>
                )}
                {!mostrarBoton && (
                    <td style={tdStyle}>
                        <span style={{
                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                            background: ec.bg, color: ec.color, border: `1px solid ${ec.border}`,
                        }}>{ec.label}</span>
                    </td>
                )}
            </tr>
        )
    }

    return (
        <div style={{
            padding: '24px',
            background: 'rgba(13,31,60,0.45)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            height: 'calc(100vh - 90px)',
            overflowY: 'auto',
        }}>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '22px', fontWeight: 600, margin: 0 }}>Historial</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>
                    {enCurso.length} en curso · {completados.length} completados
                </p>
            </div>

            {/* Tabla en curso */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    En curso
                </h2>
                <div style={cardStyle}>
                    {isLoading ? (
                        <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>
                    ) : enCurso.length === 0 ? (
                        <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No hay mantenimientos en curso</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Equipo', 'Cliente', 'Técnico', 'Tipo', 'Fecha entrada', 'Fecha estimada', ''].map(h => (
                                        <th key={h} style={thStyle}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {enCurso.map(a => <FilaTabla key={a.id} a={a} mostrarBoton={true} />)}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Tabla historial */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 500, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Completados
                    </h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input
                            style={inputStyle}
                            placeholder="Buscar cliente..."
                            value={filtroCliente}
                            onChange={e => setFiltroCliente(e.target.value)}
                        />
                        <input
                            style={inputStyle}
                            placeholder="Buscar equipo..."
                            value={filtroEquipo}
                            onChange={e => setFiltroEquipo(e.target.value)}
                        />
                        <input
                            style={inputStyle}
                            placeholder="Nº de serie..."
                            value={filtroSerie}
                            onChange={e => setFiltroSerie(e.target.value)}
                        />
                        <input
                            style={{ ...inputStyle, colorScheme: 'dark' }}
                            type="date"
                            value={filtroFecha}
                            onChange={e => setFiltroFecha(e.target.value)}
                        />
                    </div>
                </div>
                <div style={cardStyle}>
                    {isLoading ? (
                        <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>
                    ) : completados.length === 0 ? (
                        <div style={{ padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No hay mantenimientos completados</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Equipo', 'Cliente', 'Técnico', 'Tipo', 'Fecha entrada', 'Fecha salida', 'Estado'].map(h => (
                                        <th key={h} style={thStyle}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {completados.map(a => <FilaTabla key={a.id} a={a} mostrarBoton={false} />)}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}