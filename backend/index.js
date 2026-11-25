const express = require('express');
const sequelize = require('./db/connection');
const Usuario = require('./Modelos/Usuario');
const Persona = require('./Modelos/Persona');
const RolUsuario = require('./Modelos/RolUsuario');

var cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// ==========================================
// 1. INICIO DE SESIÓN (LOGIN)
// ==========================================
app.post('/login', async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;

        // Buscamos el usuario cruzando con PERSONA (por correo y cuenta activa) y Rol_Usuario
        const usuario = await Usuario.findOne({
            where: { contrasena: contrasena },
            include: [
                {
                    model: Persona,
                    as: 'persona',
                    where: { 
                        correo_electronico: correo_electronico,
                        estado_cuenta: true 
                    }
                },
                {
                    model: RolUsuario,
                    as: 'rol'
                }
            ]
        });

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos, o cuenta inactiva' });
        }

        // Devolvemos los datos del usuario y su rol (1=ADMIN, 2=OPERADOR, 3=USUARIO)
        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id_usuario: usuario.id_usuario,
                id_persona: usuario.persona.id_persona,
                nombre: usuario.persona.nombre,
                apellido: usuario.persona.apellido,
                correo_electronico: usuario.persona.correo_electronico,
                id_rol_usuario: usuario.id_rol_usuario,
                nombre_rol: usuario.rol.nombre_rol
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Ocurrio un error: ' + error });
    }
});

// ==========================================
// 2. OBTENER ROLES (Para el select en Next.js)
// ==========================================
app.get('/roles', async (req, res) => {
    try {
        const roles = await RolUsuario.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Ocurrio un error: ' + error });
    }
});

// ==========================================
// 3. CRUD DE USUARIOS (CREATE, READ, UPDATE, DELETE)
// ==========================================

// READ: Listar usuarios activos
app.get('/usuario', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['contrasena'] }, // No enviamos la contraseña al listar
            include: [
                {
                    model: Persona,
                    as: 'persona',
                    where: { estado_cuenta: true }
                },
                {
                    model: RolUsuario,
                    as: 'rol'
                }
            ]
        });

        res.status(200).json(usuarios);

    } catch (error) {
        res.status(500).json({ error: 'Ocurrio un error: ' + error });
    }
});

// CREATE: Registrar nuevo usuario (Sirve tanto para el Registro público como para el Admin)
app.post('/usuario', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        console.log(req.body);
        const { nombre, apellido, correo_electronico, telefono, fecha_nacimiento, contrasena, id_rol_usuario } = req.body;

        // 1. Insertar en PERSONA
        const nuevaPersona = await Persona.create({
            nombre,
            apellido,
            correo_electronico,
            telefono,
            fecha_nacimiento,
            fecha_registro: new Date(),
            estado_cuenta: true
        }, { transaction: t });

        // 2. Insertar en Usuario (si no viene rol, por defecto es 3 = USUARIO)
        await Usuario.create({
            id_persona: nuevaPersona.id_persona,
            id_rol_usuario: id_rol_usuario || 3,
            contrasena: contrasena
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ mensaje: 'Usuario agregado correctamente' });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Ocurrio un error: ' + error });
    }
});

// UPDATE: Actualizar datos personales, rol o contraseña
app.put('/usuario/:id_usuario', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { nombre, apellido, correo_electronico, telefono, fecha_nacimiento, id_rol_usuario, contrasena } = req.body;

        const usuarioEncontrado = await Usuario.findByPk(req.params.id_usuario);

        if (!usuarioEncontrado) {
            await t.rollback();
            return res.status(400).json({ mensaje: 'No se actualizo, usuario no encontrado' });
        }

        // Actualizar tabla PERSONA
        await Persona.update({
            nombre,
            apellido,
            correo_electronico,
            telefono,
            fecha_nacimiento
        }, {
            where: { id_persona: usuarioEncontrado.id_persona },
            transaction: t
        });

        // Preparar datos a actualizar en Usuario
        const datosUsuario = {};
        if (id_rol_usuario) datosUsuario.id_rol_usuario = id_rol_usuario;
        if (contrasena) datosUsuario.contrasena = contrasena;

        if (Object.keys(datosUsuario).length > 0) {
            await Usuario.update(datosUsuario, {
                where: { id_usuario: req.params.id_usuario },
                transaction: t
            });
        }

        await t.commit();
        res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Ocurrio un error: ' + error });
    }
});

// DELETE: Borrado lógico (desactiva estado_cuenta en PERSONA)
app.delete('/usuario/:id_usuario', async (req, res) => {
    try {
        const usuarioEncontrado = await Usuario.findByPk(req.params.id_usuario);

        if (!usuarioEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const [updated] = await Persona.update(
            { estado_cuenta: false },
            { where: { id_persona: usuarioEncontrado.id_persona } }
        );

        if (updated) {
            res.status(200).send({ mensaje: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario: ' + error });
    }
});

app.listen(5000, () => {
    console.log('Aplicacion ejecutando en puerto 5000');
});