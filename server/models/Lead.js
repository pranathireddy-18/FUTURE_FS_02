const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  source: {
    type: DataTypes.ENUM('Website', 'LinkedIn', 'Referral', 'Other'),
    allowNull: false,
    defaultValue: 'Website',
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'converted'),
    allowNull: false,
    defaultValue: 'new',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'leads',
  timestamps: false, // since we have createdAt manually
});

module.exports = Lead;
