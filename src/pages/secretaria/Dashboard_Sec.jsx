import { useQuery } from '@tanstack/react-query'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../../lib/supabase'
import { useUserStore } from '../../store/authStore'

export default function Dashboard_Sec() {
    const { usuario } = useUserStore()

    const { data: equipos = [] } = useQuery({
        queryKey: ['equipos_dash'],
        queryFn: async () => {
            const { data, error } = await supabase.from('equipo').select('id')
            if (error) throw error
            return data
        }
    })

    const { data: tecnicos = [] } = useQuery({
        queryKey: ['tecnicos_dash'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('usuario')
                .select('id, nombre, apellido')
                .eq('rol', 'tecnico')
                .eq('activo', true)
            if (error) throw error
            return data
        }
    })

    const { data: asignaciones = [] } = useQuery({
        queryKey: ['asignaciones_dash'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('asignacion')
                .select(`
                    id, estado, fecha_asignacion, id_usuario,
                    equipo(marca, modelo),
                    usuario:id_usuario(nombre, apellido),
                    tipo_mantenimiento:id_tipo_mantenimiento(nombre)
                `)
                .order('fecha_asignacion', { ascending: false })
            if (error) throw error
            return data
        }
    })

    const activos = asignaciones.filter(a => a.estado === 'pendiente' || a.estado === 'en_curso').length
    const delMes = asignaciones.filter(a => {
        const fecha = new Date(a.fecha_asignacion)
        const ahora = new Date()
        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
    }).length
    const ultimos5 = asignaciones.slice(0, 5)

    const trabajosPorTecnico = tecnicos.map(t => ({
        ...t,
        trabajos: asignaciones.filter(a =>
            a.id_usuario === t.id && (a.estado === 'pendiente' || a.estado === 'en_curso')
        ).length
    }))

    const ultimos30 = Array.from({ length: 30 }, (_, i) => {
        const fecha = new Date()
        fecha.setDate(fecha.getDate() - (29 - i))
        const label = fecha.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit' })
        const count = asignaciones.filter(a => {
            const f = new Date(a.fecha_asignacion)
            return f.toDateString() === fecha.toDateString()
        }).length
        return { fecha: label, cantidad: count }
    })

    const cardStyle = {
        background: 'rgba(13,31,60,0.45)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
    }

    const estadoStyle = (estado) => {
        if (estado === 'en_curso') return { bg: 'rgba(37,99,235,0.15)', color: '#60a5fa', border: 'rgba(37,99,235,0.3)', label: 'En curso' }
        if (estado === 'pendiente') return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)', label: 'Pendiente' }
        return { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)', label: 'Completado' }
    }

    const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

    const stats = [
        { label: 'Equipos registrados', value: equipos.length, color: '#60a5fa' },
        { label: 'Mantenimientos activos', value: activos, color: '#34d399' },
        { label: 'Técnicos activos', value: tecnicos.length, color: '#a78bfa' },
        { label: 'Mantenimientos del mes', value: delMes, color: '#f97316' },
    ]

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
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '22px', fontWeight: 600, margin: 0 }}>
                    Bienvenida, {usuario?.user_metadata?.nombre || 'Secretaria'}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>
                    Resumen general del sistema
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {stats.map(s => (
                    <div key={s.label} style={{ ...cardStyle, padding: '20px 24px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                        <p style={{ color: s.color, fontSize: '32px', fontWeight: 700, margin: 0 }}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <h2 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Últimos mantenimientos
                    </h2>
                    <div style={cardStyle}>
                        {ultimos5.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Sin mantenimientos</div>
                        ) : ultimos5.map((a, i) => {
                            const ec = estadoStyle(a.estado)
                            return (
                                <div key={a.id} style={{
                                    padding: '14px 18px',
                                    borderBottom: i < ultimos5.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <div>
                                        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 500 }}>
                                            {a.equipo?.marca} {a.equipo?.modelo}
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '2px' }}>
                                            {a.tipo_mantenimiento?.nombre || '—'} · {formatFecha(a.fecha_asignacion)}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                                        background: ec.bg, color: ec.color, border: `1px solid ${ec.border}`,
                                        whiteSpace: 'nowrap',
                                    }}>{ec.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Técnicos
                    </h2>
                    <div style={cardStyle}>
                        {trabajosPorTecnico.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Sin técnicos</div>
                        ) : trabajosPorTecnico.map((t, i) => (
                            <div key={t.id} style={{
                                padding: '14px 18px',
                                borderBottom: i < trabajosPorTecnico.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'rgba(37,99,235,0.25)',
                                        border: '1px solid rgba(37,99,235,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 600, color: '#60a5fa', flexShrink: 0,
                                    }}>
                                        {t.nombre?.[0]?.toUpperCase()}{t.apellido?.[0]?.toUpperCase()}
                                    </div>
                                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>
                                        {t.nombre} {t.apellido}
                                    </span>
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 500, color: t.trabajos > 0 ? '#fbbf24' : '#34d399' }}>
                                    {t.trabajos} trabajo{t.trabajos !== 1 ? 's' : ''} activo{t.trabajos !== 1 ? 's' : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '28px' }}>
                <h2 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Mantenimientos — últimos 30 días
                </h2>
                <div style={{ ...cardStyle, padding: '24px' }}>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={ultimos30}>
                            <defs>
                                <linearGradient id="colorMant" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="fecha" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} interval={4} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}
                                labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                                formatter={(value) => [value, 'Mantenimientos']}
                            />
                            <Area type="monotone" dataKey="cantidad" stroke="#3b82f6" strokeWidth={2} fill="url(#colorMant)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}