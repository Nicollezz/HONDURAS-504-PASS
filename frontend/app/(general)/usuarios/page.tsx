'use client'
import { useAuthContext } from '@/providers/AuthProvider'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function UsuariosPage() {
  const { usuarioSesion, cerrarSesion } = useAuthContext()
  const router = useRouter()

  const [usuarios, setUsuarios] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])

  const [idEditando, setIdEditando] = useState<number | null>(null)
  const [nombre, setNombre] = useState<string>('')
  const [apellido, setApellido] = useState<string>('')
  const [correo_electronico, setCorreoElectronico] = useState<string>('')
  const [telefono, setTelefono] = useState<string>('')
  const [fecha_nacimiento, setFechaNacimiento] = useState<string>('')
  const [contrasena, setContrasena] = useState<string>('')
  const [id_rol_usuario, setIdRolUsuario] = useState<number>(3)

  async function cargarUsuarios() {
    try {
      const res = await axios.get('http://localhost:5000/usuario')
      setUsuarios(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  async function cargarRoles() {
    try {
      const res = await axios.get('http://localhost:5000/roles')
      setRoles(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!usuarioSesion) {
      router.push('/')
      return
    }

    if (usuarioSesion.id_rol_usuario !== 1) {
      alert('Acceso denegado: solo administradores')
      router.push('/inicio')
      return
    }

    cargarUsuarios()
    cargarRoles()
  }, [usuarioSesion])

  if (!usuarioSesion || usuarioSesion.id_rol_usuario !== 1) {
    return null
  }

  function limpiarFormulario() {
    setIdEditando(null)
    setNombre('')
    setApellido('')
    setCorreoElectronico('')
    setTelefono('')
    setFechaNacimiento('')
    setContrasena('')
    setIdRolUsuario(3)
  }

  async function guardarUsuario() {
    try {
      if (nombre == '' || apellido == '' || correo_electronico == '' || telefono == '' || fecha_nacimiento == '') {
        alert('Complete todos los campos obligatorios')
        return
      }

      if (idEditando != null) {
        const res = await axios.put(`http://localhost:5000/usuario/${idEditando}`, {
          nombre,
          apellido,
          correo_electronico,
          telefono,
          fecha_nacimiento,
          contrasena,
          id_rol_usuario
        })

        if (res.status == 200) {
          alert('Usuario actualizado exitosamente')
          limpiarFormulario()
          cargarUsuarios()
        }
      } else {
        if (contrasena == '') {
          alert('Ingrese una contrasena para el nuevo usuario')
          return
        }

        const res = await axios.post('http://localhost:5000/usuario', {
          nombre,
          apellido,
          correo_electronico,
          telefono,
          fecha_nacimiento,
          contrasena,
          id_rol_usuario
        })

        if (res.status == 200) {
          alert('Usuario creado exitosamente')
          limpiarFormulario()
          cargarUsuarios()
        }
      }
    } catch (error) {
      console.error(error)
      alert('Ocurrio un error al guardar el usuario')
    }
  }

  function seleccionarUsuario(item: any) {
    setIdEditando(item.id_usuario)
    setNombre(item.persona?.nombre || '')
    setApellido(item.persona?.apellido || '')
    setCorreoElectronico(item.persona?.correo_electronico || '')
    setTelefono(item.persona?.telefono || '')
    setFechaNacimiento(item.persona?.fecha_nacimiento ? item.persona.fecha_nacimiento.split('T')[0] : '')
    setContrasena('')
    setIdRolUsuario(item.id_rol_usuario || 3)
  }

  async function eliminarUsuario(id: number) {
    const confirmar = confirm('Desea desactivar este usuario?')
    if (!confirmar) return

    try {
      const res = await axios.delete(`http://localhost:5000/usuario/${id}`)
      if (res.status == 200) {
        alert('Usuario desactivado')
        cargarUsuarios()
      }
    } catch (error) {
      console.error(error)
      alert('Ocurrio un error al desactivar')
    }
  }

  return (
    <div className='min-h-screen bg-white text-black p-6'>
      <div className='max-w-5xl mx-auto'>

        <div className='border-b border-black pb-3 mb-6 flex justify-between items-center'>
          <h4 className='text-lg font-semibold uppercase tracking-wide'>
            Gestion de Usuarios
          </h4>
          <div className='flex gap-3 items-center text-sm'>
            <Link href='/inicio' className='underline text-black'>
              Volver a Inicio
            </Link>
            <button
              type='button'
              onClick={cerrarSesion}
              className='border border-black bg-black text-white px-3 py-1 text-xs'
            >
              Cerrar Sesion
            </button>
          </div>
        </div>

        <div className='border border-black p-5 mb-8 bg-white'>
          <h5 className='text-sm font-semibold uppercase tracking-wide border-b border-black pb-2 mb-4'>
            {idEditando != null ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
          </h5>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-3 text-sm'>
            <input
              type='text'
              placeholder='Nombre'
              className='border border-black bg-white text-black px-3 py-2 focus:outline-none placeholder-neutral-500'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <input
              type='text'
              placeholder='Apellido'
              className='border border-black bg-white text-black px-3 py-2 focus:outline-none placeholder-neutral-500'
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />

            <input
              type='email'
              placeholder='Correo electronico'
              className='border border-black bg-white text-black px-3 py-2 focus:outline-none placeholder-neutral-500'
              value={correo_electronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
            />

            <input
              type='text'
              placeholder='Telefono'
              className='border border-black bg-white text-black px-3 py-2 focus:outline-none placeholder-neutral-500'
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

            <input
              type='date'
              className='border border-black bg-white text-black px-3 py-2 focus:outline-none'
              value={fecha_nacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />

            <select
              className='border border-black bg-white text-black px-3 py-2 focus:outline-none'
              value={id_rol_usuario}
              onChange={(e) => setIdRolUsuario(Number(e.target.value))}
            >
              {roles.length > 0 ? (
                roles.map((rol: any) => (
                  <option key={rol.id_rol_usuario} value={rol.id_rol_usuario}>
                    {rol.nombre_rol}
                  </option>
                ))
              ) : (
                <>
                  <option value={1}>ADMINISTRADOR</option>
                  <option value={2}>OPERADOR DE RUTA 1</option>
                  <option value={3}>USUARIO</option>
                </>
              )}
            </select>

            <input
              type='password'
              placeholder={idEditando != null ? 'Nueva contrasena (opcional)' : 'Contrasena'}
              className='border border-black bg-white text-black px-3 py-2 focus:outline-none placeholder-neutral-500'
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          <div className='flex gap-3 mt-4'>
            <button
              type='button'
              onClick={guardarUsuario}
              className='bg-black text-white border border-black px-4 py-2 text-sm font-medium'
            >
              {idEditando != null ? 'Actualizar' : 'Guardar'}
            </button>

            {idEditando != null && (
              <button
                type='button'
                onClick={limpiarFormulario}
                className='bg-white text-black border border-black px-4 py-2 text-sm'
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className='border border-black overflow-x-auto'>
          <table className='w-full text-left border-collapse text-sm'>
            <thead>
              <tr className='border-b border-black bg-white'>
                <th className='p-3 border-r border-black font-semibold'>ID</th>
                <th className='p-3 border-r border-black font-semibold'>Nombre Completo</th>
                <th className='p-3 border-r border-black font-semibold'>Correo</th>
                <th className='p-3 border-r border-black font-semibold'>Telefono</th>
                <th className='p-3 border-r border-black font-semibold'>Rol</th>
                <th className='p-3 font-semibold'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u: any) => (
                <tr key={u.id_usuario} className='border-b border-black last:border-b-0'>
                  <td className='p-3 border-r border-black'>{u.id_usuario}</td>
                  <td className='p-3 border-r border-black'>
                    {u.persona?.nombre} {u.persona?.apellido}
                  </td>
                  <td className='p-3 border-r border-black'>{u.persona?.correo_electronico}</td>
                  <td className='p-3 border-r border-black'>{u.persona?.telefono}</td>
                  <td className='p-3 border-r border-black'>
                    {u.rol_usuario?.nombre_rol || u.id_rol_usuario}
                  </td>
                  <td className='p-3 flex gap-2'>
                    <button
                      type='button'
                      onClick={() => seleccionarUsuario(u)}
                      className='border border-black bg-white text-black px-2 py-1 text-xs'
                    >
                      Editar
                    </button>
                    <button
                      type='button'
                      onClick={() => eliminarUsuario(u.id_usuario)}
                      className='border border-black bg-black text-white px-2 py-1 text-xs'
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={6} className='p-4 text-center text-neutral-600'>
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}