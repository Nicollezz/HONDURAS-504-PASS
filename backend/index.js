const express = require('express');
const sequelize = require('./db/connection');
const Usuario = require('./Modelos/Usuario');
const Persona = require('./Modelos/Persona');
const RolUsuario = require('./Modelos/RolUsuario');
const CodigoQR = require('./Modelos/CodigoQR');
const crypto = require('crypto');

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


// ==========================================
// 4. GENERAR CODIGO QR
// ==========================================

app.post('/qr/generar', async (req, res) => {
    try {
        const { id_usuario } = req.body;

        if (!id_usuario) {
            return res.status(400).json({
                mensaje: 'Usuario no especificado'
            });
        }

        // Desactivar códigos anteriores del usuario
        await CodigoQR.update(
            { estado_qr: false },
            { where: { id_usuario, estado_qr: true } }
        );

        // Generar token aleatorio
        const token = crypto.randomBytes(32).toString('hex');

        const fechaCreacion = new Date();

        // Duración de cinco minutos
        const duracion = 300;

        const fechaExpiracion = new Date(
            fechaCreacion.getTime() + duracion * 1000
        );

        const nuevoQR = await CodigoQR.create({
            estado_qr: true,
            duracion_qr: duracion,
            token_qr: token,
            fecha_creacion: fechaCreacion,
            fecha_expiracion: fechaExpiracion,
            fecha_uso: null,
            id_usuario: id_usuario,
            id_historial: null
        });

        res.status(201).json({
            mensaje: 'QR generado correctamente',
            token_qr: nuevoQR.token_qr,
            duracion_qr: duracion,
            fecha_expiracion: fechaExpiracion
        });

    } catch (error) {
        console.error('Error al generar QR:', error);
        res.status(500).json({
            mensaje: 'Error al generar el código QR'
        });
    }
});


// ==========================================
// 5. VALIDAR CODIGO QR
// ==========================================

app.post('/qr/validar', async (req, res) => {
    try {
        const { token_qr } = req.body;

        if (!token_qr) {
            return res.status(400).json({
                mensaje: 'Token no proporcionado'
            });
        }

        const qr = await CodigoQR.findOne({
            where: {
                token_qr: token_qr,
                estado_qr: true
            }
        });

        if (!qr) {
            return res.status(400).json({
                mensaje: 'Código QR inválido o ya utilizado'
            });
        }

        const ahora = new Date();

        if (ahora >= new Date(qr.fecha_expiracion)) {
            await qr.update({ estado_qr: false });

            return res.status(400).json({
                mensaje: 'El código QR ha expirado'
            });
        }

        await qr.update({
            estado_qr: false,
            fecha_uso: ahora.toTimeString().slice(0, 8)
        });

        res.status(200).json({
            mensaje: 'Pase exitoso'
        });

    } catch (error) {
        console.error('Error al validar QR:', error);
        res.status(500).json({
            mensaje: 'Error al validar el código QR'
        });
    }
});


app.listen(5000, () => {
    console.log('Aplicacion ejecutando en puerto 5000');
});