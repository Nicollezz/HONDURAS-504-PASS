'use client'
import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Plantilla } from '../app/Modelos/Plantilla'
import { Usuario, RolUsuario } from '../app/Modelos/Usuario'
import { ContextUsuario } from '../context/ContextUsuario'

export default function ProviderUsuario({ children }: Plantilla) {

    const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);
    const [listaRoles, setListaRoles] = useState<RolUsuario[]>([]);

    const [id_usuario, setIdUsuario] = useState<number>(0);
    const [nombre, setNombre] = useState<string>('');
    const [apellido, setApellido] = useState<string>('');
    const [correo_electronico, setCorreoElectronico] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    const [fecha_nacimiento, setFechaNacimiento] = useState<string>('');
    const [contrasena, setContrasena] = useState<string>('');
    const [id_rol_usuario, setIdRolUsuario] = useState<number>(3);

    async function cargarRoles() {
        try {
            const res = await axios.get('http://localhost:5000/roles')
            setListaRoles(res.data)
        } catch (error) {
            alert('Ocurrio un error al cargar los roles')
        }
    }

    async function cargarUsuarios() {
        try {
            const res = await axios.get('http://localhost:5000/usuario')
            setListaUsuarios(res.data)
        } catch (error) {
            alert('Ocurrio un error al cargar los usuarios')
        }
    }

    function handleEditar(usuario: Usuario) {
        setIdUsuario(usuario.id_usuario)
        setNombre(usuario.persona.nombre)
        setApellido(usuario.persona.apellido)
        setCorreoElectronico(usuario.persona.correo_electronico)
        setTelefono(usuario.persona.telefono)
        setFechaNacimiento(usuario.persona.fecha_nacimiento.split('T')[0])
        setIdRolUsuario(usuario.id_rol_usuario)
        setContrasena('')
    }

    async function handleDelete(id: number) {
        try {
            await axios.delete('http://localhost:5000/usuario/' + id)
            alert('Usuario eliminado')
            cargarUsuarios()
        } catch (error) {
            alert('Ocurrio un error al eliminar el usuario')
        }
    }

    return (
        <ContextUsuario.Provider value={{
            listaUsuarios,
            listaRoles,
            id_usuario,
            nombre,
            apellido,
            correo_electronico,
            telefono,
            fecha_nacimiento,
            contrasena,
            id_rol_usuario,
            setIdUsuario,
            setNombre,
            setApellido,
            setCorreoElectronico,
            setTelefono,
            setFechaNacimiento,
            setContrasena,
            setIdRolUsuario,
            cargarRoles,
            cargarUsuarios,
            handleEditar,
            handleDelete
        }}>
            {children}
        </ContextUsuario.Provider>
    )
}

export function useContextUsuario() {
    return useContext(ContextUsuario)
}