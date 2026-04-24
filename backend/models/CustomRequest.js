const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const CustomRequest = sequelize.define('CustomRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true
  },
  surah: {
    type: DataTypes.STRING,
    allowNull: true
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  colors: {
    type: DataTypes.STRING,
    allowNull: true
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = CustomRequest;
