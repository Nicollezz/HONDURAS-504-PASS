'use client'
import { useAuthContext } from '@/providers/AuthProvider'
import Link from 'next/link'
import React from 'react'

export default function InicioPage() {
  const { usuarioSesion, cerrarSesion } = useAuthContext()

  return (
    <div className='min-h-screen bg-white text-black flex items-center justify-center p-4'>
      <div className='w-full max-w-sm border border-black p-6 bg-white'>
        <h4 className='text-lg font-semibold uppercase tracking-wide border-b border-black pb-3 mb-5'>
          Honduras504Pass
        </h4>

        <p className='text-sm mb-6'>
          Bienvenido, {usuarioSesion?.persona?.nombre || usuarioSesion?.correo_electronico || 'Usuario'}
        </p>

        <div className='flex flex-col gap-3'>
          <Link
            href='/usuarios'
            className='w-full text-center bg-black text-white border border-black py-2 text-sm font-medium'
          >
            Continuar
          </Link>

          <button
            type='button'
            onClick={cerrarSesion}
            className='w-full bg-white text-black border border-black py-2 text-sm'
          >
            Cerrar Sesion
          </button>
        </div>
      </div>
    </div>
  )
}