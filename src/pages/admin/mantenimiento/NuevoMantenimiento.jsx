import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../../../lib/supabase'
import { useLocation } from 'react-router-dom'

const schema = z.object({
    id_equipo: z.string().min(1, 'Seleccioná un equipo'),
    id_usuario: z.string().min(1, 'Seleccioná un técnico'),
    id_tipo_mantenimiento: z.string().min(1, 'Seleccioná un tipo'),
    fecha_estimada: z.string().min(1, 'Ingresá una fecha'),
    observaciones: z.string().optional(),
})

export default function NuevoMantenimiento() {
    const [errorMsg, setErrorMsg] = useState('')
    const [exito, setExito] = useState(false)
    const queryClient = useQueryClient()

    const { data: equipos = [] } = useQuery({
        queryKey: ['equipos'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('equipo')
                .select('id, marca, modelo, cliente(nombre)')
            if (error) throw error
            return data
        }
    })

    const { data: tecnicos = [] } = useQuery({
        queryKey: ['tecnicos'],
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

    const { data: tipos = [] } = useQuery({
        queryKey: ['tipos_mantenimiento'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tipo_mantenimiento')
                .select('id, nombre')
            if (error) throw error
            return data
        }
    })

    const { data: asignaciones = [] } = useQuery({
        queryKey: ['asignaciones'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('asignacion')
                .select('id, estado, fecha_asignacion')
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

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const crear = useMutation({
        mutationFn: async (values) => {
            const { error } = await supabase.from('asignacion').insert({
                id_equipo: parseInt(values.id_equipo),
                id_usuario: values.id_usuario,
                fecha_asignacion: new Date().toISOString(),
                fecha_estimada: values.fecha_estimada,
                estado: 'pendiente',
                id_tipo_mantenimiento: parseInt(values.id_tipo_mantenimiento),
                observaciones: values.observaciones || null,
            })
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['asignaciones'] })
            reset()
            setErrorMsg('')
            setExito(true)
            setTimeout(() => setExito(false), 3000)
        },
        onError: (err) => setErrorMsg(err.message || 'Error al crear el mantenimiento'),
    })

    const cardStyle = {
        background: 'rgba(13,31,60,0.45)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
    }

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '8px',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    }

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '6px',
    }

    const cards = [
        { label: 'Equipos registrados', value: equipos.length, color: '#60a5fa' },
        { label: 'Mantenimientos activos', value: activos, color: '#34d399' },
        { label: 'Mantenimientos del mes', value: delMes, color: '#a78bfa' },
    ]

    const location = useLocation()
    const equipoPreseleccionado = location.state?.id_equipo

    return (
        <div style={{
            padding: '24px',
            background: 'rgba(13,31,60,0.45)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            minHeight: 'calc(100vh - 90px)',
        }}>
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '22px', fontWeight: 600, margin: 0 }}>Mantenimientos</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>
                    {activos} mantenimiento{activos !== 1 ? 's' : ''} activo{activos !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {cards.map(c => (
                    <div key={c.label} style={{ ...cardStyle, padding: '20px 24px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</p>
                        <p style={{ color: c.color, fontSize: '32px', fontWeight: 700, margin: 0 }}>{c.value}</p>
                    </div>
                ))}
            </div>

            {/* Formulario */}
            <div style={{ ...cardStyle, padding: '28px', maxWidth: '600px' }}>
                <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: 600, margin: '0 0 20px' }}>
                    Registrar nuevo mantenimiento
                </h2>

                <form onSubmit={handleSubmit(values => { setErrorMsg(''); crear.mutate(values) })}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={labelStyle}>Equipo</label>
                            <select {...register('id_equipo')} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="" style={{ background: '#0d1f3c' }}>Seleccionar...</option>
                                {equipos.map(e => (
                                    <option key={e.id} value={e.id} style={{ background: '#0d1f3c' }}>
                                        {e.marca} {e.modelo} — {e.cliente?.nombre || 'Sin cliente'}
                                    </option>
                                ))}
                            </select>
                            {errors.id_equipo && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.id_equipo.message}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Técnico</label>
                            <select {...register('id_usuario')} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="" style={{ background: '#0d1f3c' }}>Seleccionar...</option>
                                {tecnicos.map(t => (
                                    <option key={t.id} value={t.id} style={{ background: '#0d1f3c' }}>
                                        {t.nombre} {t.apellido}
                                    </option>
                                ))}
                            </select>
                            {errors.id_usuario && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.id_usuario.message}</p>}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={labelStyle}>Tipo de mantenimiento</label>
                            <select {...register('id_tipo_mantenimiento')} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="" style={{ background: '#0d1f3c' }}>Seleccionar...</option>
                                {tipos.map(t => (
                                    <option key={t.id} value={t.id} style={{ background: '#0d1f3c' }}>
                                        {t.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.id_tipo_mantenimiento && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.id_tipo_mantenimiento.message}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Fecha estimada</label>
                            <input {...register('fecha_estimada')} type="date" style={{ ...inputStyle, colorScheme: 'dark' }} />
                            {errors.fecha_estimada && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.fecha_estimada.message}</p>}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Observaciones <span style={{ color: 'rgba(255,255,255,0.25)' }}>(opcional)</span></label>
                        <textarea
                            {...register('observaciones')}
                            placeholder="Notas adicionales..."
                            rows={3}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>

                    {errorMsg && (
                        <div style={{
                            marginBottom: '16px', padding: '12px 16px',
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '8px', color: '#f87171', fontSize: '13px',
                        }}>{errorMsg}</div>
                    )}

                    {exito && (
                        <div style={{
                            marginBottom: '16px', padding: '12px 16px',
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                            borderRadius: '8px', color: '#34d399', fontSize: '13px',
                        }}>Mantenimiento registrado correctamente</div>
                    )}

                    <button
                        type="submit"
                        disabled={crear.isPending}
                        style={{
                            padding: '10px 24px',
                            background: crear.isPending ? 'rgba(37,99,235,0.4)' : 'rgba(37,99,235,0.8)',
                            border: '1px solid rgba(37,99,235,0.5)', borderRadius: '8px',
                            color: 'white', fontSize: '14px', fontWeight: 500,
                            cursor: crear.isPending ? 'not-allowed' : 'pointer',
                        }}
                    >{crear.isPending ? 'Guardando...' : 'Guardar mantenimiento'}</button>
                </form>
            </div>
        </div>
    )
}