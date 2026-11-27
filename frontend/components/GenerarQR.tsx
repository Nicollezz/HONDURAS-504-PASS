
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuthContext } from '../context/AuthContext';

export default function GenerarQR() {

    const { usuarioSesion } = useAuthContext();

    const [tokenQR, setTokenQR] = useState('');
    const [segundos, setSegundos] = useState(0);
    const [mensaje, setMensaje] = useState('');

    // Cuenta regresiva de cinco minutos
    useEffect(() => {
        if (!tokenQR) return;

        const intervalo = setInterval(() => {
            setSegundos((actual) => {
                if (actual <= 1) {
                    clearInterval(intervalo);
                    setTokenQR('');
                    setMensaje('El código QR ha expirado');
                    return 0;
                }

                return actual - 1;
            });
        }, 1000);

        return () => clearInterval(intervalo);

    }, [tokenQR]);

    // Generar QR
    async function generarQR() {
        if (!usuarioSesion) {
            setMensaje('Debe iniciar sesión');
            return;
        }

        try {
            const respuesta = await axios.post(
                'http://localhost:5000/qr/generar',
                {
                    id_usuario: usuarioSesion.id_usuario
                }
            );

            setTokenQR(respuesta.data.token_qr);
            setSegundos(300);
            setMensaje('Código QR generado correctamente');

        } catch (error) {
            console.error(error);
            setMensaje('Error al generar el código QR');
        }
    }

    // Simular lectura del QR
    async function validarQR() {
        try {
            const respuesta = await axios.post(
                'http://localhost:5000/qr/validar',
                {
                    token_qr: tokenQR
                }
            );

            setMensaje(respuesta.data.mensaje);
            setTokenQR('');
            setSegundos(0);

        } catch (error: any) {
            setMensaje(
                error.response?.data?.mensaje ||
                'Error al validar el código'
            );
        }
    }

    function formatoTiempo() {
        const minutos = Math.floor(segundos / 60);
        const restantes = segundos % 60;

        return `${String(minutos).padStart(2, '0')}:${String(restantes).padStart(2, '0')}`;
    }

    return (
        <div className="container text-center py-4">

            <h2 className="mb-4">Mi pase de transporte</h2>

            {tokenQR ? (
                <>
                    <div className="d-flex justify-content-center mb-3">
                        <div className="bg-white p-3 border rounded">
                            <QRCodeCanvas
                                value={tokenQR}
                                size={220}
                            />
                        </div>
                    </div>

                    <h3 className="text-primary">
                        {formatoTiempo()}
                    </h3>

                    <p>Tiempo restante para utilizar el QR</p>

                    <button
                        className="btn btn-success mb-3"
                        onClick={validarQR}
                    >
                        Simular lectura del pase
                    </button>
                </>
            ) : (
                <button
                    className="btn btn-primary"
                    onClick={generarQR}
                >
                    Generar código QR
                </button>
            )}

            {mensaje && (
                <div className="alert alert-info mt-3">
                    {mensaje}
                </div>
            )}

        </div>
    );
}