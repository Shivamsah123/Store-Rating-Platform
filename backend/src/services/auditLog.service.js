const auditLogRepository = require('../repositories/auditLog.repository');

class AuditLogService {
  async log(action, performedBy, targetId, details) {
    try {
      const detailsStr = details && typeof details === 'object' 
        ? JSON.stringify(details) 
        : details;
      
      return await auditLogRepository.create({
        action,
        performedBy,
        targetId: String(targetId),
        details: detailsStr
      });
    } catch (error) {
      // Don't crash the main request if logging fails, but log the error
      console.error('Failed to write audit log:', error);
    }
  }

  async getLogs(limit = 100) {
    return auditLogRepository.findAll({
      order: [['createdAt', 'DESC']],
      limit
    });
  }
}

module.exports = new AuditLogService();
