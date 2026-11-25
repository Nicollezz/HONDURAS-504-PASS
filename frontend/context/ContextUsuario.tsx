'use client'
import { createContext } from "react";
import { Usuario, RolUsuario } from "../app/Modelos/Usuario";

export const ContextUsuario = createContext({
    listaUsuarios: [] as Usuario[],
    listaRoles: [] as RolUsuario[],
    id_usuario: 0,
    nombre: '',
    apellido: '',
    correo_electronico: '',
    telefono: '',
    fecha_nacimiento: '',
    contrasena: '',
    id_rol_usuario: 3,
    setIdUsuario: (id: number) => { },
    setNombre: (nombre: string) => { },
    setApellido: (apellido: string) => { },
    setCorreoElectronico: (correo: string) => { },
    setTelefono: (telefono: string) => { },
    setFechaNacimiento: (fecha: string) => { },
    setContrasena: (contrasena: string) => { },
    setIdRolUsuario: (idRol: number) => { },
    cargarRoles: () => { },
    cargarUsuarios: () => { },
    handleEditar: (usuario: Usuario) => { },
    handleDelete: (id: number) => { },
});