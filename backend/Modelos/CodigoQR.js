
const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const CodigoQR = sequelize.define('codigo_qr', {
    id_codigo_qr: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estado_qr: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    duracion_qr: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token_qr: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_expiracion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_uso: {
        type: DataTypes.TIME,
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_historial: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'codigo_qr',
    timestamps: false
});

module.exports = CodigoQR;