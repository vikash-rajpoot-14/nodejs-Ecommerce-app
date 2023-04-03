const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('./../util/database');


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: DataTypes.STRING
})


module.exports = User