'use client'
import { useAuthContext } from '@/providers/AuthProvider'
import axios from 'axios'
import React, { useState } from 'react'

export default function LoginForm() {

  const { iniciarSesion } = useAuthContext()

  const [esRegistro, setEsRegistro] = useState<boolean>(false)
  const [nombre, setNombre] = useState<string>('')
  const [apellido, setApellido] = useState<string>('')
  const [correo_electronico, setCorreoElectronico] = useState<string>('')
  const [telefono, setTelefono] = useState<string>('')
  const [fecha_nacimiento, setFechaNacimiento] = useState<string>('')
  const [contrasena, setContrasena] = useState<string>('')

  async function login() {
    if (correo_electronico != '' && contrasena != '') {
      await iniciarSesion(correo_electronico, contrasena)
    }
    else {
      alert('Usuario incorrecto')
    }
  }

  async function registrar() {
    try {
      if (nombre != '' && apellido != '' && correo_electronico != '' && telefono != '' && fecha_nacimiento != '' && contrasena != '') {
        const res = await axios.post('http://localhost:5000/usuario', {
          nombre,
          apellido,
          correo_electronico,
          telefono,
          fecha_nacimiento,
          contrasena,
          id_rol_usuario: 3
        })

        if (res.status == 200) {
          alert('Registro creado exitosamente')
          setNombre('')
          setApellido('')
          setCorreoElectronico('')
          setTelefono('')
          setFechaNacimiento('')
          setContrasena('')
          setEsRegistro(false)
        }
        else {
          alert('Ocurrio un error al invocar el servicio')
        }
      }
      else {
        alert('Complete todos los campos')
      }
    } catch (error) {
      console.error(error)
      alert('Ocurrio un error al registrar')
    }
  }

  return (
    <div className='min-h-screen bg-white text-black flex items-center justify-center p-4'>
      <div className='w-full max-w-sm border border-black p-6 bg-white'>
        <h4 className='text-lg font-semibold uppercase tracking-wide border-b border-black pb-3 mb-5'>
          {esRegistro ? 'Registro de usuario' : 'Inicio de sesion'}
        </h4>

        <form className='flex flex-col gap-3'>

          {esRegistro && (
            <>
              <input
                type='text'
                placeholder='Ingrese su nombre'
                className='w-full border border-black bg-white text-black px-3 py-2 text-sm focus:outline-none placeholder-neutral-500'
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <input
                type='text'
                placeholder='Ingrese su apellido'
                className='w-full border border-black bg-white text-black px-3 py-2 text-sm focus:outline-none placeholder-neutral-500'
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />

              <input
                type='text'
                placeholder='Ingrese su telefono'
                className='w-full border border-black bg-white text-black px-3 py-2 text-sm focus:outline-none placeholder-neutral-500'
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />

              <input
                type='date'
                placeholder='Fecha de nacimiento'
                className='w-full border border-black bg-white text-black px-3 py-2 text-sm focus:outline-none'
                value={fecha_nacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </>
          )}

          <input
            type='text'
            placeholder='Ingrese su email'
            className='w-full border border-black bg-white text-black px-3 py-2 text-sm focus:outline-none placeholder-neutral-500'
            value={correo_electronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
          />

          <input
            type='password'
            placeholder='Ingrese contrasena'
            className='w-full border border-black bg-white text-black px-3 py-2 text-sm focus:outline-none placeholder-neutral-500'
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          {esRegistro ? (
            <button
              type='button'
              className='w-full bg-black text-white border border-black py-2 text-sm font-medium mt-2'
              onClick={registrar}
            >
              Registrarse
            </button>
          ) : (
            <button
              type='button'
              className='w-full bg-black text-white border border-black py-2 text-sm font-medium mt-2'
              onClick={login}
            >
              Iniciar sesion
            </button>
          )}

          <button
            type='button'
            className='w-full bg-white text-black border border-black py-2 text-sm'
            onClick={() => setEsRegistro(!esRegistro)}
          >
            {esRegistro ? 'Ya tengo cuenta, iniciar sesion' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  )
}