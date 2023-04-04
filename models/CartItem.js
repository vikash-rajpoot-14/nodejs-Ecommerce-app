const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('./../util/database');


const CartItem = sequelize.define('cartItem', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: DataTypes.INTEGER
})


module.exports = CartItem;