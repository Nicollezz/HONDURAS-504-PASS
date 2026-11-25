const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const RolUsuario = sequelize.define('rol_usuario', {
    id_rol_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_rol: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'Rol_Usuario',
    timestamps: false
});

module.exports = RolUsuario;