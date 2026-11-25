const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');
const Persona = require('./Persona');
const RolUsuario = require('./RolUsuario');

const Usuario = sequelize.define('usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_rol_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING(255), //agregar en la bd
        allowNull: false
    }
}, {
    tableName: 'Usuario',
    timestamps: false
});

Usuario.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' });
Usuario.belongsTo(RolUsuario, { foreignKey: 'id_rol_usuario', as: 'rol' });

module.exports = Usuario;