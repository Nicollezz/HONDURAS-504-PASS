const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Persona = sequelize.define('persona', {
    id_persona: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    correo_electronico: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado_cuenta: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'PERSONA',
    timestamps: false
});

module.exports = Persona;