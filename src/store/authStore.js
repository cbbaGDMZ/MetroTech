import { create } from "zustand";

const useUserStore = create((set) => ({
    usuario: null,
    rol: null,
    loading: true,
    setUsuario: (nuevousuario, nuevorol) =>
        set({
            usuario: nuevousuario,
            rol: nuevorol,
            loading: false, // 👈 esto faltaba
        }),
    clearUsuario: () =>
        set({
            usuario: null,
            rol: null,
            loading: false, // 👈 esto faltaba
        })
}));

export { useUserStore };