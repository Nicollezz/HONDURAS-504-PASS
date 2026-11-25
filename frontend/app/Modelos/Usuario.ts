export interface RolUsuario {
  id_rol_usuario: number;
  nombre_rol: string;
}

export interface Persona {
  id_persona: number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  telefono: string;
  fecha_nacimiento: string;
  fecha_registro: string;
  estado_cuenta: boolean;
}

export interface Usuario {
  id_usuario: number;
  id_rol_usuario: number;
  id_persona: number;
  persona: Persona;
  rol: RolUsuario;
}

export interface UsuarioForm {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  telefono: string;
  fecha_nacimiento: string;
  contrasena?: string;
  id_rol_usuario: number;
}