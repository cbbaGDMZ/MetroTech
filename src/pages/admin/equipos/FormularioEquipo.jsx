import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'

const FormularioEquipo = () => {
    const navigate = useNavigate()
    const [paso, setPaso] = useState(1)
    const [datosCliente, setDatosCliente] = useState({ nombre: '', telefono: '', empresa: '', direccion: '' })
    const [datosEquipo, setDatosEquipo] = useState({ marca: '', modelo: '', num_serie: '', tipo_equipo: '' })
    const [clienteId, setClienteId] = useState(null)
    const [cargando, setCargando] = useState(false)

    const handleClienteSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        const { data, error } = await supabase
            .from('cliente')
            .insert([{ nombre: datosCliente.nombre, telefono: datosCliente.telefono, empresa: datosCliente.empresa, direccion: datosCliente.direccion }])
            .select()
        if (error) { console.log(error) }
        else { setClienteId(data[0].id_cliente); setPaso(2) }
        setCargando(false)
    }

    const handleEquipoSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        const { error } = await supabase
            .from('equipo')
            .insert([{ id_cliente: clienteId, marca: datosEquipo.marca, modelo: datosEquipo.modelo, num_serie: datosEquipo.num_serie, tipo_equipo: datosEquipo.tipo_equipo }])
        if (error) { console.log(error) }
        else { setPaso(3) }
        setCargando(false)
    }

    const inputClass = "w-full bg-transparent text-sm text-white/80 placeholder-white/25 outline-none"
    const inputWrapper = "flex items-center gap-2 px-3 py-2.5 rounded-lg"
    const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }

    return (
        <div className="w-full min-h-full p-6"
            style={{ backgroundColor: "rgba(13, 31, 60, 0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px" }}
        >
            <h1 className="text-white/90 text-lg font-semibold mb-6">Registrar Equipo</h1>

            <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${paso === n ? 'bg-blue-600 text-white border-2 border-blue-400' : paso > n ? 'bg-blue-600/80 text-white' : 'bg-white/10 text-white/40 border border-white/20'}`}>
                            {paso > n ? '✓' : n}
                        </div>
                        {n < 3 && <div className={`w-16 h-0.5 mx-1 ${paso > n ? 'bg-blue-600' : 'bg-white/10'}`} />}
                    </div>
                ))}
            </div>

            {paso === 1 && (
                <form onSubmit={handleClienteSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Datos del cliente</p>
                    <div className={inputWrapper} style={inputStyle}>
                        <input type="text" placeholder="Nombre completo *" required className={inputClass} value={datosCliente.nombre} onChange={(e) => setDatosCliente({...datosCliente, nombre: e.target.value})} />
                    </div>
                    <div className={inputWrapper} style={inputStyle}>
                        <input type="text" placeholder="Teléfono *" required className={inputClass} value={datosCliente.telefono} onChange={(e) => setDatosCliente({...datosCliente, telefono: e.target.value})} />
                    </div>
                    <div className={inputWrapper} style={inputStyle}>
                        <input type="text" placeholder="Empresa (opcional)" className={inputClass} value={datosCliente.empresa} onChange={(e) => setDatosCliente({...datosCliente, empresa: e.target.value})} />
                    </div>
                    <div className={inputWrapper} style={inputStyle}>
                        <input type="text" placeholder="Dirección (opcional)" className={inputClass} value={datosCliente.direccion} onChange={(e) => setDatosCliente({...datosCliente, direccion: e.target.value})} />
                    </div>
                    <button type="submit" disabled={cargando} className="mt-2 py-2.5 rounded-xl text-sm font-medium text-white/90 cursor-pointer" style={{ background: "rgba(37,99,235,0.8)", border: "1px solid rgba(255,255,255,0.12)" }}>
                        {cargando ? 'Guardando...' : 'Siguiente →'}
                    </button>
                </form>
            )}

            {paso === 2 && (
                <form onSubmit={handleEquipoSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Datos del equipo</p>
                    <div className={inputWrapper} style={inputStyle}>
                        <input type="text" placeholder="Marca *" required className={inputClass} value={datosEquipo.marca} onChange={(e) => setDatosEquipo({...datosEquipo, marca: e.target.value})} />
                    </div>
                    <div className={inputWrapper} style={inputStyle}>
                        <input type="text" placeholder="Modelo *" required className={inputClass} value={datosEquipo.modelo} onChange={(e) => setDatosEquipo({...datosEquipo, modelo: e.target.value})} />
                    </div>
                    <div className={inputWrapper} style={inputStyle}>
                        <input type="text" placeholder="Número de serie *" required className={inputClass} value={datosEquipo.num_serie} onChange={(e) => setDatosEquipo({...datosEquipo, num_serie: e.target.value})} />
                    </div>
                    <div className={inputWrapper} style={inputStyle}>
                        <select required className={inputClass} value={datosEquipo.tipo_equipo} onChange={(e) => setDatosEquipo({...datosEquipo, tipo_equipo: e.target.value})} style={{ background: 'transparent' }}>
                            <option value="" disabled>Tipo de equipo *</option>
                            <option value="Estación Total">Estación Total</option>
                            <option value="GPS">GPS</option>
                            <option value="Nivel">Nivel</option>
                            <option value="Teodolito">Teodolito</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setPaso(1)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>← Atrás</button>
                        <button type="submit" disabled={cargando} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/90 cursor-pointer" style={{ background: "rgba(37,99,235,0.8)", border: "1px solid rgba(255,255,255,0.12)" }}>
                            {cargando ? 'Guardando...' : 'Siguiente →'}
                        </button>
                    </div>
                </form>
            )}

            {paso === 3 && (
                <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
                    <p className="text-white/40 text-xs uppercase tracking-widest">Equipo registrado</p>
                    <div className="w-full p-6 rounded-xl flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex justify-between"><span className="text-white/40 text-sm">Cliente</span><span className="text-white/80 text-sm">{datosCliente.nombre}</span></div>
                        <div className="flex justify-between"><span className="text-white/40 text-sm">Marca</span><span className="text-white/80 text-sm">{datosEquipo.marca}</span></div>
                        <div className="flex justify-between"><span className="text-white/40 text-sm">Modelo</span><span className="text-white/80 text-sm">{datosEquipo.modelo}</span></div>
                        <div className="flex justify-between"><span className="text-white/40 text-sm">N° Serie</span><span className="text-white/80 text-sm">{datosEquipo.num_serie}</span></div>
                        <div className="flex justify-between"><span className="text-white/40 text-sm">Tipo</span><span className="text-white/80 text-sm">{datosEquipo.tipo_equipo}</span></div>
                    </div>
                    <button onClick={() => navigate('/admin/mantenimiento/nuevo')} className="w-full py-2.5 rounded-xl text-sm font-medium text-white/90 cursor-pointer" style={{ background: "rgba(37,99,235,0.8)", border: "1px solid rgba(255,255,255,0.12)" }}>
                        Ir a Nuevo Mantenimiento →
                    </button>
                </div>
            )}
        </div>
    )
}

export default FormularioEquipo