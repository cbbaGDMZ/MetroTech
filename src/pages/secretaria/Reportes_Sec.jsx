import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import jsPDF from 'jspdf'

export default function Reportes_Sec() {
    const [seleccionado, setSeleccionado] = useState(null)
    const [filtro, setFiltro] = useState('')

    const { data: mantenimientos = [], isLoading } = useQuery({
        queryKey: ['mantenimientos_completados'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('asignacion')
                .select(`
                    id, estado, fecha_asignacion, fecha_estimada, observaciones,
                    equipo(marca, modelo, num_serie, tipo_equipo, cliente(nombre, telefono, direccion)),
                    usuario:id_usuario(nombre, apellido),
                    tipo_mantenimiento:id_tipo_mantenimiento(nombre)
                `)
                .eq('estado', 'completado')
                .order('fecha_asignacion', { ascending: false })
            if (error) throw error
            return data
        }
    })

    const filtrados = mantenimientos.filter(m => {
        const equipo = m.equipo
        const texto = `${equipo?.marca} ${equipo?.modelo} ${equipo?.num_serie} ${m.usuario?.nombre} ${m.usuario?.apellido}`.toLowerCase()
        return texto.includes(filtro.toLowerCase())
    })

    const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

    const generarPDF = () => {
        if (!seleccionado) return
        const m = seleccionado
        const doc = new jsPDF()
        const azul = [10, 31, 60]
        const blanco = [255, 255, 255]
        const grisClaro = [245, 245, 245]
        const grisTexto = [100, 100, 100]
        const negro = [30, 30, 30]

        doc.setFillColor(...azul)
        doc.rect(0, 0, 210, 35, 'F')
        doc.setTextColor(...blanco)
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        doc.text('MetroTech', 14, 16)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text('Sistema de gestión de equipos topográficos', 14, 24)
        doc.text('Cochabamba, Bolivia', 14, 30)

        doc.setTextColor(...negro)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('Reporte de Mantenimiento', 14, 48)
        doc.setDrawColor(200, 200, 200)
        doc.line(14, 52, 196, 52)

        let y = 62
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...azul)
        doc.text('DATOS DEL EQUIPO', 14, y)
        y += 8
        doc.setFillColor(...grisClaro)
        doc.rect(14, y, 182, 30, 'F')
        doc.setTextColor(...grisTexto)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text('Marca / Modelo', 18, y + 7)
        doc.text('Número de serie', 80, y + 7)
        doc.text('Tipo de equipo', 140, y + 7)
        doc.setTextColor(...negro)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${m.equipo?.marca || '—'} ${m.equipo?.modelo || ''}`, 18, y + 16)
        doc.text(m.equipo?.num_serie || '—', 80, y + 16)
        doc.text(m.equipo?.tipo_equipo || '—', 140, y + 16)
        y += 38

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...azul)
        doc.text('DATOS DEL CLIENTE', 14, y)
        y += 8
        doc.setFillColor(...grisClaro)
        doc.rect(14, y, 182, 30, 'F')
        doc.setTextColor(...grisTexto)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text('Nombre', 18, y + 7)
        doc.text('Teléfono', 100, y + 7)
        doc.setTextColor(...negro)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(m.equipo?.cliente?.nombre || '—', 18, y + 16)
        doc.text(m.equipo?.cliente?.telefono || '—', 100, y + 16)
        y += 38

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...azul)
        doc.text('DETALLES DEL MANTENIMIENTO', 14, y)
        y += 8
        doc.setFillColor(...grisClaro)
        doc.rect(14, y, 182, 30, 'F')
        doc.setTextColor(...grisTexto)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text('Tipo de mantenimiento', 18, y + 7)
        doc.text('Fecha de entrada', 100, y + 7)
        doc.text('Fecha de salida', 150, y + 7)
        doc.setTextColor(...negro)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(m.tipo_mantenimiento?.nombre || '—', 18, y + 16)
        doc.text(formatFecha(m.fecha_asignacion), 100, y + 16)
        doc.text(formatFecha(m.fecha_estimada), 150, y + 16)
        y += 38

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...azul)
        doc.text('TÉCNICO A CARGO', 14, y)
        y += 8
        doc.setFillColor(...grisClaro)
        doc.rect(14, y, 182, 20, 'F')
        doc.setTextColor(...negro)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${m.usuario?.nombre || '—'} ${m.usuario?.apellido || ''}`, 18, y + 13)
        y += 28

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...azul)
        doc.text('OBSERVACIONES', 14, y)
        y += 8
        doc.setFillColor(...grisClaro)
        doc.rect(14, y, 182, 24, 'F')
        doc.setTextColor(...negro)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const obs = m.observaciones || 'Sin observaciones.'
        const obsLines = doc.splitTextToSize(obs, 170)
        doc.text(obsLines, 18, y + 9)
        y += 32

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...azul)
        doc.text('COSTO DEL SERVICIO', 14, y)
        y += 8
        doc.setFillColor(...grisClaro)
        doc.rect(14, y, 182, 20, 'F')
        doc.setTextColor(...grisTexto)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text('Bs.', 18, y + 13)
        doc.setDrawColor(150, 150, 150)
        doc.line(28, y + 14, 100, y + 14)
        y += 30

        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...azul)
        doc.text('FIRMA DEL CLIENTE', 14, y)
        y += 16
        doc.setDrawColor(100, 100, 100)
        doc.line(14, y, 100, y)
        doc.setTextColor(...grisTexto)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text('Firma y sello', 14, y + 6)

        doc.setFillColor(...azul)
        doc.rect(0, 278, 210, 20, 'F')
        doc.setTextColor(...blanco)
        doc.setFontSize(8)
        doc.text('MetroTech — Cochabamba, Bolivia', 14, 287)
        doc.text(`Generado el ${new Date().toLocaleDateString('es-BO')}`, 140, 287)

        doc.save(`reporte_${m.equipo?.marca}_${m.equipo?.num_serie || m.id}.pdf`)
    }

    const cardStyle = {
        background: 'rgba(13,31,60,0.45)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
    }

    const inputStyle = {
        padding: '9px 14px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '8px',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '13px',
        outline: 'none',
        width: '260px',
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
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '22px', fontWeight: 600, margin: 0 }}>Reportes</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>
                    Seleccioná un mantenimiento completado para generar su reporte
                </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <input
                    style={inputStyle}
                    placeholder="Buscar por equipo o técnico..."
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <h2 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Mantenimientos completados
                    </h2>
                    <div style={cardStyle}>
                        {isLoading ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>
                        ) : filtrados.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Sin resultados</div>
                        ) : filtrados.map((m, i) => (
                            <div
                                key={m.id}
                                onClick={() => setSeleccionado(m)}
                                style={{
                                    padding: '14px 18px',
                                    borderBottom: i < filtrados.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    cursor: 'pointer',
                                    background: seleccionado?.id === m.id ? 'rgba(37,99,235,0.15)' : 'transparent',
                                    borderLeft: seleccionado?.id === m.id ? '2px solid #3b82f6' : '2px solid transparent',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { if (seleccionado?.id !== m.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                                onMouseLeave={e => { if (seleccionado?.id !== m.id) e.currentTarget.style.background = 'transparent' }}
                            >
                                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500 }}>
                                    {m.equipo?.marca} {m.equipo?.modelo}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '3px' }}>
                                    {m.tipo_mantenimiento?.nombre || '—'} · {m.usuario?.nombre} {m.usuario?.apellido} · {new Date(m.fecha_asignacion).toLocaleDateString('es-BO')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Vista previa
                    </h2>
                    {!seleccionado ? (
                        <div style={{ ...cardStyle, padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                            Seleccioná un mantenimiento para ver el detalle
                        </div>
                    ) : (
                        <div style={{ ...cardStyle, padding: '24px' }}>
                            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Equipo</p>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 600, margin: 0 }}>
                                    {seleccionado.equipo?.marca} {seleccionado.equipo?.modelo}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '4px 0 0' }}>
                                    S/N: {seleccionado.equipo?.num_serie || '—'}
                                </p>
                            </div>

                            {[
                                { label: 'Cliente', value: seleccionado.equipo?.cliente?.nombre || '—' },
                                { label: 'Técnico', value: `${seleccionado.usuario?.nombre} ${seleccionado.usuario?.apellido}` },
                                { label: 'Tipo', value: seleccionado.tipo_mantenimiento?.nombre || '—' },
                                { label: 'Fecha entrada', value: formatFecha(seleccionado.fecha_asignacion) },
                                { label: 'Fecha salida', value: formatFecha(seleccionado.fecha_estimada) },
                                { label: 'Observaciones', value: seleccionado.observaciones || 'Sin observaciones' },
                            ].map(f => (
                                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{f.label}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{f.value}</span>
                                </div>
                            ))}

                            <button
                                onClick={generarPDF}
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    padding: '11px',
                                    background: 'rgba(37,99,235,0.8)',
                                    border: '1px solid rgba(37,99,235,0.5)',
                                    borderRadius: '8px',
                                    color: 'white', fontSize: '14px', fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Generar PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}