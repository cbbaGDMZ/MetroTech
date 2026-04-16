import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase, supabaseAdmin } from '../../lib/supabase'

const schema = z.object({
    nombre: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres').regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/, 'Solo letras y espacios'),
    apellido: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres').regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/, 'Solo letras y espacios'),
    email: z.string().email('Email inválido'),
    telefono: z.string().min(7, 'Mínimo 7 dígitos').max(8, 'Máximo 8 dígitos').regex(/^\d+$/, 'Solo números'),
    rol: z.enum(['admin', 'tecnico', 'secretaria'], { required_error: 'Seleccioná un rol' }),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const fetchUsuarios = async () => {
    const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

const rolColor = (rol) => {
    if (rol === 'admin') return { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.3)' }
    if (rol === 'tecnico') return { bg: 'rgba(37,99,235,0.15)', color: '#60a5fa', border: 'rgba(37,99,235,0.3)' }
    return { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' }
}

const estadoColor = (activo) => activo
    ? { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)', label: 'Activo' }
    : { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af', border: 'rgba(107,114,128,0.3)', label: 'Inactivo' }

export default function Personal() {
    const [modalOpen, setModalOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const queryClient = useQueryClient()

    const { data: usuarios = [], isLoading } = useQuery({
        queryKey: ['usuarios'],
        queryFn: fetchUsuarios,
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    })

    const crearUsuario = useMutation({
        mutationFn: async (values) => {
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: values.email,
                password: values.password,
                email_confirm: true,
                user_metadata: { rol: values.rol, nombre: values.nombre },
            })
            if (authError) throw authError

            const { error: dbError } = await supabase.from('usuario').insert({
                id: authData.user.id,
                nombre: values.nombre,
                apellido: values.apellido,
                email: values.email,
                telefono: values.telefono,
                rol: values.rol,
                activo: true,
                password_hash: '—',
            })
            if (dbError) throw dbError
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios'] })
            reset()
            setModalOpen(false)
            setErrorMsg('')
        },
        onError: (err) => {
            setErrorMsg(err.message || 'Error al crear el usuario')
        },
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

    return (
        <div style={{ padding: '0 0 0 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '22px', fontWeight: 600, margin: 0 }}>Personal</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>
                        {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} registrado{usuarios.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => { setModalOpen(true); setErrorMsg('') }}
                    style={{
                        padding: '10px 20px',
                        background: 'rgba(37,99,235,0.8)',
                        border: '1px solid rgba(37,99,235,0.5)',
                        borderRadius: '8px',
                        color: 'white', fontSize: '14px', fontWeight: 500,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                >
                    <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
                    Nuevo usuario
                </button>
            </div>

            <div style={cardStyle}>
                {isLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>
                ) : usuarios.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No hay usuarios registrados</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                {['Nombre', 'Email', 'Teléfono', 'Rol', 'Estado'].map(h => (
                                    <th key={h} style={{
                                        padding: '14px 20px', textAlign: 'left',
                                        fontSize: '12px', fontWeight: 500,
                                        color: 'rgba(255,255,255,0.4)',
                                        textTransform: 'uppercase', letterSpacing: '0.05em',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u, i) => {
                                const rc = rolColor(u.rol)
                                const ec = estadoColor(u.activo)
                                return (
                                    <tr key={u.id}
                                        style={{ borderBottom: i < usuarios.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '34px', height: '34px', borderRadius: '50%',
                                                    background: 'rgba(37,99,235,0.25)',
                                                    border: '1px solid rgba(37,99,235,0.3)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '13px', fontWeight: 600, color: '#60a5fa', flexShrink: 0,
                                                }}>
                                                    {u.nombre?.[0]?.toUpperCase()}{u.apellido?.[0]?.toUpperCase()}
                                                </div>
                                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 500 }}>
                                                    {u.nombre} {u.apellido}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{u.email}</td>
                                        <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{u.telefono || '—'}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                                                background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`,
                                            }}>{u.rol}</span>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                                                background: ec.bg, color: ec.color, border: `1px solid ${ec.border}`,
                                            }}>{ec.label}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {modalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
                }}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '520px', padding: '28px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', fontWeight: 600, margin: 0 }}>Nuevo usuario</h2>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '4px 0 0' }}>Se creará acceso al sistema</p>
                            </div>
                            <button
                                onClick={() => { setModalOpen(false); reset(); setErrorMsg('') }}
                                style={{
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                                    borderRadius: '8px', color: 'rgba(255,255,255,0.6)',
                                    width: '34px', height: '34px', cursor: 'pointer', fontSize: '18px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >×</button>
                        </div>

                        <form onSubmit={handleSubmit(values => { setErrorMsg(''); crearUsuario.mutate(values) })}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Nombre</label>
                                    <input {...register('nombre')} placeholder="Diego" style={inputStyle} />
                                    {errors.nombre && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.nombre.message}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Apellido</label>
                                    <input {...register('apellido')} placeholder="López" style={inputStyle} />
                                    {errors.apellido && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.apellido.message}</p>}
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>Email</label>
                                <input {...register('email')} type="email" placeholder="usuario@metrotech.com" style={inputStyle} />
                                {errors.email && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Teléfono</label>
                                    <input {...register('telefono')} placeholder="70012345" style={inputStyle} />
                                    {errors.telefono && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.telefono.message}</p>}
                                </div>
                                <div>
                                    <label style={labelStyle}>Rol</label>
                                    <select {...register('rol')} style={{ ...inputStyle, cursor: 'pointer' }}>
                                        <option value="" style={{ background: '#0d1f3c' }}>Seleccionar...</option>
                                        <option value="admin" style={{ background: '#0d1f3c' }}>Admin</option>
                                        <option value="tecnico" style={{ background: '#0d1f3c' }}>Técnico</option>
                                        <option value="secretaria" style={{ background: '#0d1f3c' }}>Secretaria</option>
                                    </select>
                                    {errors.rol && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.rol.message}</p>}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={labelStyle}>Contraseña</label>
                                <input {...register('password')} type="password" placeholder="Mínimo 6 caracteres" style={inputStyle} />
                                {errors.password && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>}
                            </div>

                            {errorMsg && (
                                <div style={{
                                    marginBottom: '16px', padding: '12px 16px',
                                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                    borderRadius: '8px', color: '#f87171', fontSize: '13px',
                                }}>{errorMsg}</div>
                            )}

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => { setModalOpen(false); reset(); setErrorMsg('') }}
                                    style={{
                                        padding: '10px 20px', background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px',
                                        color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer',
                                    }}
                                >Cancelar</button>
                                <button
                                    type="submit"
                                    disabled={crearUsuario.isPending}
                                    style={{
                                        padding: '10px 24px',
                                        background: crearUsuario.isPending ? 'rgba(37,99,235,0.4)' : 'rgba(37,99,235,0.8)',
                                        border: '1px solid rgba(37,99,235,0.5)', borderRadius: '8px',
                                        color: 'white', fontSize: '14px', fontWeight: 500,
                                        cursor: crearUsuario.isPending ? 'not-allowed' : 'pointer',
                                    }}
                                >{crearUsuario.isPending ? 'Creando...' : 'Crear usuario'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}