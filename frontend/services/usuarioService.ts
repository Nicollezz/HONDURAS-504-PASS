import axios from 'axios';
import { Usuario, UsuarioForm, RolUsuario } from '../app/Modelos/Usuario';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

export const usuarioService = {
  login: async (correo_electronico: string, contrasena: string) => {
    const { data } = await api.post('/login', { correo_electronico, contrasena });
    return data;
  },

  getRoles: async (): Promise<RolUsuario[]> => {
    const { data } = await api.get<RolUsuario[]>('/roles');
    return data;
  },

  getUsuarios: async (): Promise<Usuario[]> => {
    const { data } = await api.get<Usuario[]>('/usuario');
    return data;
  },

  crearUsuario: async (usuario: UsuarioForm) => {
    const { data } = await api.post('/usuario', usuario);
    return data;
  },

  actualizarUsuario: async (id_usuario: number, usuario: UsuarioForm) => {
    const { data } = await api.put(`/usuario/${id_usuario}`, usuario);
    return data;
  },

  eliminarUsuario: async (id_usuario: number) => {
    const { data } = await api.delete(`/usuario/${id_usuario}`);
    return data;
  },
};