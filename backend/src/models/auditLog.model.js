const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  action: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  performedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  targetId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  updatedAt: false // Audit logs are insert-only, no updates are needed
});

module.exports = AuditLog;
