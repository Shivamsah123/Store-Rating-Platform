const { AuditLog, User } = require('../models');

class AuditLogRepository {
  async create(logData) {
    return AuditLog.create(logData);
  }

  async findAll(options = {}) {
    return AuditLog.findAll({
      ...options,
      include: [
        { model: User, as: 'performer', attributes: ['id', 'name', 'email', 'role'] }
      ]
    });
  }
}

module.exports = new AuditLogRepository();
