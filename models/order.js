const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('./../util/database');


const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    autoIncrement: true
  }
})


module.exports = Order;
