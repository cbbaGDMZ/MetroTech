import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../lib/supabase";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom"


const loginschema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().max(20, "Máximo 20 caracteres")
})

const Login = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState : {errors},
    } = useForm({
        resolver: zodResolver(loginschema), //conecta Zod con ract hook form
    })


    const navigate = useNavigate()

    const onSubmit = async (data) => {
        console.log('onSubmit ejecutado', data)
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })
            console.log('authData:', authData)
            console.log('error:', error)

            if (error) {
                setError('root', { message: 'Correo o contraseña incorrectos' })
            } else {
                const rol = authData.user.user_metadata.rol
                console.log('rol:', rol)
                if (rol === 'admin') navigate('/admin/dashboard')
                else if (rol === 'tecnico') navigate('/tecnico/dashboard')
                else if (rol === 'secretaria') navigate('/secretaria/dashboard')
            }
        } catch (e) {
            console.error('excepción:', e)
        }
    }

    return(
        <div className="bg-animated min-h-screen w-full flex items-center">

            {/* Mitad izquierda - card */}
            <div className="w-1/2 flex items-center justify-center">
                <div
                    className="flex flex-col items-center px-10 py-12"
                    style={{
                        width: "320px",
                        height: "498px",
                        backgroundColor: "rgba(15, 30, 60, 0.29)",
                        borderRadius: "55px",
                        border: "1px solid rgba(255, 255, 255, 0.10)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                    }}
                >
                    {/* Ícono usuario */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1.5px solid rgba(255,255,255,0.2)"
                        }}
                    >
                        <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
                            <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                            <circle cx="24" cy="19" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                            <path d="M10 40c0-7.732 6.268-14 14-14s14 6.268 14 14"
                                stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </div>

                    {/* Título */}
                    <h1 className="text-lg font-bold tracking-widest text-white/90 uppercase mb-6"
                        style={{ letterSpacing: "0.15em" }}
                    >
                        Iniciar Sesión
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5" noValidate>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-white/40 tracking-wider uppercase">
                                Usuario
                            </label>
                            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.10)"
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                    <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8"/>
                                    <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                                        stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                                <input
                                    type="email"
                                    className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-400/80">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-white/40 tracking-wider uppercase">
                                Contraseña
                            </label>
                            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.10)"
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                    <rect x="5" y="11" width="14" height="10" rx="2"
                                        stroke="rgba(255,255,255,0.35)" strokeWidth="1.8"/>
                                    <path d="M8 11V7a4 4 0 0 1 8 0v4"
                                        stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" strokeLinecap="round"/>
                                    <circle cx="12" cy="16" r="1.2" fill="rgba(255,255,255,0.35)"/>
                                </svg>
                                <input
                                    type="password"
                                    className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-400/80">{errors.password.message}</p>}
                        </div>

                        {errors.root && (
                            <p className="text-xs text-red-400/80 text-center">{errors.root.message}</p>
                        )}

                        {/* Botón */}
                        <button
                            type="submit"
                            className="mt-1 w-full py-3 rounded-2xl text-sm font-semibold tracking-widest uppercase text-white/90 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:brightness-125"
                            style={{
                                background: "linear-gradient(135deg, rgba(30,60,120,0.9) 0%, rgba(10,20,50,0.95) 100%)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
                            }}
                        >
                            Iniciar Sesión
                        </button>

                    </form>
                </div>
            </div>

            {/* Mitad derecha - imagen */}
            <div className="w-1/2 flex items-end justify-end pr-100 h-screen overflow-hidden">
                <img
                    src="src/public/imagenlogin.png"
                    alt="Topógrafo"
                    style={{
                        height: "800px",
                        filter: "brightness(0) invert(1) opacity(0.15)",
                    }}
                />
            </div>

        </div>
    )
}


export default Login

