'use client';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Plantilla } from '../app/Modelos/Plantilla';
import { AuthContext, UsuarioSesion } from '../context/AuthContext';

export default function AuthProvider({ children }: Plantilla) {

    const [usuarioSesion, setUsuarioSesion] = useState<UsuarioSesion | null>(null);
    const router = useRouter();

    useEffect(() => {
        const sesionGuardada = localStorage.getItem('usuario_honduras504pass');
        if (sesionGuardada) {
            setUsuarioSesion(JSON.parse(sesionGuardada));
        }
    }, []);

    async function iniciarSesion(correo_electronico: string, contrasena: string) {
        try {
            const res = await axios.post('http://localhost:5000/login', {
                correo_electronico,
                contrasena
            });
            setUsuarioSesion(res.data.usuario);
            localStorage.setItem('usuario_honduras504pass', JSON.stringify(res.data.usuario));
            alert('Bienvenido ' + res.data.usuario.nombre);
            router.push('/inicio');
        } catch (error) {
            alert('Correo o contraseña incorrectos');
        }
    }

    function cerrarSesion() {
        setUsuarioSesion(null);
        localStorage.removeItem('usuario_honduras504pass');
        router.push('/');
    }

    return (
        <AuthContext.Provider value={{ usuarioSesion, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}