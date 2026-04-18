// src/pages/tecnico/Dashboard_Tec.jsx
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useUserStore } from '../../store/authStore'

const fetchDashboardTec = async (userId) => {
    const [asignaciones, reportes] = await Promise.all([
        supabase
            .from('asignacion')
            .select(`
                id,
                fecha_asignacion,
                fecha_estimada,
                estado,
                tipo_mantenimiento ( nombre ),
                equipo (
                    codigo_auto,
                    marca,
                    modelo,
                    tipo_equipo,
                    cliente ( nombre, empresa )
                )
            `)
            .eq('id_usuario', userId)
            .order('fecha_asignacion', { ascending: false }),

        supabase
            .from('reporte')
            .select(`
                id,
                fecha_reporte,
                costo,
                estado,
                diagnostico,
                tipo_mantenimiento ( nombre ),
                asignacion (
                    equipo (
                        codigo_auto,
                        marca,
                        modelo,
                        cliente ( nombre )
                    )
                )
            `)
            .eq('id_tecnico_actual', userId)
            .order('fecha_reporte', { ascending: false })
            .limit(5),
    ])

    if (asignaciones.error) throw asignaciones.error
    if (reportes.error) throw reportes.error

    return {
        asignaciones: asignaciones.data,
        reportes: reportes.data,
    }
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

const IconTool = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const IconClock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)
const IconCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)
const IconMoney = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 12h.01M18 12h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
)
const IconEmpty = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2 opacity-20">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
)

const StatCard = ({ icon, label, value, color, bg, borderColor }) => (
    <div className="flex items-center gap-4 px-5 py-4 rounded-xl"
        style={{ backgroundColor: bg, border: `1px solid ${borderColor}` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20`, color }}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
        </div>
    </div>
)

const Dashboard_Tec = () => {
    const { usuario } = useUserStore()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['dashboard-tecnico', usuario?.id],
        queryFn: () => fetchDashboardTec(usuario?.id),
        enabled: !!usuario?.id,
    })

    if (isLoading) return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Cargando dashboard...</p>
            </div>
        </div>
    )

    if (isError) return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 90px)' }}>
            <p className="text-red-400 text-sm">Error al cargar el dashboard.</p>
        </div>
    )

    const { asignaciones, reportes } = data

    const pendientes   = asignaciones.filter(a => a.estado === 'pendiente')
    const enCurso      = asignaciones.filter(a => a.estado === 'en_curso')
    const completadas  = asignaciones.filter(a => a.estado === 'completado')
    const costoTotal   = reportes.reduce((acc, r) => acc + (Number(r.costo) || 0), 0)

    // Próximas a vencer — pendientes + en_curso con fecha_estimada, ordenadas
    const proximasAVencer = [...pendientes, ...enCurso]
        .filter(a => a.fecha_estimada)
        .sort((a, b) => new Date(a.fecha_estimada) - new Date(b.fecha_estimada))
        .slice(0, 5)

    const hoy = new Date()
    const diasRestantes = (fechaStr) => {
        const diff = new Date(fechaStr) - hoy
        const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))
        return dias
    }

    const urgenciaColor = (dias) => {
        if (dias < 0)  return { color: '#f87171', label: 'Vencido'      }
        if (dias === 0) return { color: '#fb923c', label: 'Hoy'         }
        if (dias <= 3) return { color: '#facc15', label: `${dias}d`     }
        return              { color: '#4ade80',  label: `${dias}d`      }
    }

    const nombreTec = usuario?.user_metadata?.nombre ?? usuario?.email?.split('@')[0] ?? 'Técnico'

    return (
        <div className="flex flex-col gap-5" style={{ minHeight: 'calc(100vh - 90px)' }}>

            {/* Saludo */}
            <div style={cardStyle} className="px-6 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold" style={{ color: 'rgba(255,255,255,0.92)' }}>
                            Hola, {nombreTec} 👋
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {new Date().toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    {enCurso.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                            style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#60a5fa' }}/>
                            <span className="text-xs font-medium" style={{ color: '#60a5fa' }}>
                                {enCurso.length} trabajo{enCurso.length !== 1 ? 's' : ''} en curso
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<IconTool />}
                    label="Total asignados"
                    value={asignaciones.length}
                    color="#60a5fa"
                    bg="rgba(37,99,235,0.08)"
                    borderColor="rgba(37,99,235,0.2)"
                />
                <StatCard
                    icon={<IconClock />}
                    label="Pendientes"
                    value={pendientes.length}
                    color="#eab308"
                    bg="rgba(234,179,8,0.08)"
                    borderColor="rgba(234,179,8,0.2)"
                />
                <StatCard
                    icon={<IconCheck />}
                    label="Completados"
                    value={completadas.length}
                    color="#4ade80"
                    bg="rgba(34,197,94,0.08)"
                    borderColor="rgba(34,197,94,0.2)"
                />
                <StatCard
                    icon={<IconMoney />}
                    label="Costo generado"
                    value={costoTotal > 0 ? `Bs. ${costoTotal.toLocaleString('es-BO')}` : '—'}
                    color="#c084fc"
                    bg="rgba(168,85,247,0.08)"
                    borderColor="rgba(168,85,247,0.2)"
                />
            </div>

            {/* Dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Próximas a vencer */}
                <div style={cardStyle} className="overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: '#facc15', boxShadow: '0 0 6px #facc15' }}/>
                        <h2 className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Próximas a vencer
                        </h2>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(250,204,21,0.15)', color: '#facc15' }}>
                            {proximasAVencer.length}
                        </span>
                    </div>

                    {proximasAVencer.length === 0 ? (
                        <div className="py-12 text-center">
                            <IconEmpty />
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Sin vencimientos próximos</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.04]">
                            {proximasAVencer.map(item => {
                                const dias = diasRestantes(item.fecha_estimada)
                                const { color, label } = urgenciaColor(dias)
                                return (
                                    <div key={item.id}
                                        className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                                                    style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>
                                                    {item.equipo?.codigo_auto}
                                                </span>
                                                <BadgeEstado estado={item.estado} />
                                            </div>
                                            <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                                {item.equipo?.marca} {item.equipo?.modelo}
                                            </p>
                                            <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                                {item.equipo?.cliente?.nombre} · {item.tipo_mantenimiento?.nombre}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-bold" style={{ color }}>{label}</p>
                                            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                                {new Date(item.fecha_estimada).toLocaleDateString('es-BO')}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Últimos reportes */}
                <div style={cardStyle} className="overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }}/>
                        <h2 className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Últimos reportes
                        </h2>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>
                            {reportes.length}
                        </span>
                    </div>

                    {reportes.length === 0 ? (
                        <div className="py-12 text-center">
                            <IconEmpty />
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Sin reportes aún</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.04]">
                            {reportes.map(rep => (
                                <div key={rep.id}
                                    className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                                                style={{ backgroundColor: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>
                                                {rep.asignacion?.equipo?.codigo_auto ?? '—'}
                                            </span>
                                            <BadgeEstado estado={rep.estado} />
                                        </div>
                                        <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                            {rep.asignacion?.equipo?.marca} {rep.asignacion?.equipo?.modelo}
                                        </p>
                                        <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                            {rep.diagnostico ?? 'Sin diagnóstico'}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-semibold" style={{ color: '#c084fc' }}>
                                            {rep.costo ? `Bs. ${Number(rep.costo).toLocaleString('es-BO')}` : '—'}
                                        </p>
                                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                            {rep.fecha_reporte
                                                ? new Date(rep.fecha_reporte).toLocaleDateString('es-BO')
                                                : '—'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Dashboard_Tec