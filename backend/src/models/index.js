const sequelize = require('../config/db.config');
const User = require('./user.model');
const Store = require('./store.model');
const Rating = require('./rating.model');
const AuditLog = require('./auditLog.model');

// Associations

// User <-> Store (One-to-Many: Store Owner owns multiple stores)
User.hasMany(Store, { foreignKey: 'ownerId', as: 'ownedStores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User <-> Rating (One-to-Many: User submits many ratings)
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Store <-> Rating (One-to-Many: Store has many ratings)
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// User <-> AuditLog (One-to-Many: User performs actions recorded in logs)
User.hasMany(AuditLog, { foreignKey: 'performedBy', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'performedBy', as: 'performer' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  AuditLog
};
