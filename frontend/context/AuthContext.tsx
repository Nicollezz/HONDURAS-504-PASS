'use client';
import { createContext } from "react";

export interface UsuarioSesion {
    id_usuario: number;
    id_persona: number;
    nombre: string;
    apellido: string;
    correo_electronico: string;
    id_rol_usuario: number;
    nombre_rol: string;
}

export const AuthContext = createContext({
    usuarioSesion: null as UsuarioSesion | null,
    iniciarSesion: async (correo_electronico: string, contrasena: string) => { },
    cerrarSesion: () => { },
});