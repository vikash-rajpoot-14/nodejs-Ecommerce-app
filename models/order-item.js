const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('./../util/database');


const OrderItem = sequelize.define('orderItem', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
       quantity: DataTypes.INTEGER
})


module.exports = OrderItem;