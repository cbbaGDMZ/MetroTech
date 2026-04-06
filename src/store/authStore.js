import { create } from "zustand";

const useUserStore = create((set)=>({ //funcion que crea los estados iniciales
    //estados
    usuario : null,
    rol : null ,
    //significa que nadie esta logueado

    //acciones
    setUsuario : (nuevousuario, nuevorol) =>
        set({
            usuario: nuevousuario,
            rol:nuevorol,
        }), 
        //resive esos datos y le dice  zustand que revise esos nuevos datos y las actualiza

    //limpia el esado y lo regresa a null 
    clearUsuario : () =>
        set({
            usuario:null,
            rol:null,
        })
}));

export { useUserStore};