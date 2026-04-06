import { useEffect } from "react";
import { supabase } from  "../lib/supabase"
import { useUserStore } from "../store/authStore";

const useAuth = () => {
    const { setUsuario, clearUsuario } = useUserStore();
    //hook de react  que te permite sincronizar un componente con un sistema externo.
    useEffect(()=>{ 
        //verificar sesión activa
        supabase.auth.getSession().then(({data :{ session } })=>{
            //si hay sesion entonces continua
            if (session) {
                setUsuario(session.user, session.user.user_metadata.rol)
            //no hay sesion iniciada, limpia 
            }
            else {
                clearUsuario()
            }
        })
        //escucha cambios
        const { data : {subscription} } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUsuario(session.user, session.user.user_metadata.rol)
            }
            else {  
                clearUsuario()
            }
        })  

        //limpia la subscripcion
        return() => subscription.unsubscribe()

    },[])
}

export default useAuth;


