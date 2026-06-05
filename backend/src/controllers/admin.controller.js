const adminService = require('../services/admin.service');
const auditLogService = require('../services/auditLog.service');

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const performerId = req.user.id;
      const result = await adminService.getDashboard(performerId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const performerId = req.user.id;
      const newUser = await adminService.createUser(req.body, performerId);
      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
          user: newUser
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async createStore(req, res, next) {
    try {
      const performerId = req.user.id;
      const newStore = await adminService.createStore(req.body, performerId);
      res.status(201).json({
        status: 'success',
        message: 'Store created successfully',
        data: {
          store: newStore
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const result = await adminService.getUsers(req.query);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getStores(req, res, next) {
    try {
      const result = await adminService.getStores(req.query);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserDetails(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.getUserDetails(id);
      res.status(200).json({
        status: 'success',
        data: {
          user: result
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async globalSearch(req, res, next) {
    try {
      const { q } = req.query;
      const result = await adminService.globalSearch(q);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getRatings(req, res, next) {
    try {
      const result = await adminService.getRatings(req.query);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const logs = await auditLogService.getLogs(limit);
      res.status(200).json({
        status: 'success',
        data: {
          logs
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req, res, next) {
    try {
      const performerId = req.user.id;
      const { id } = req.params;
      const { isActive } = req.body;
      const updatedUser = await adminService.toggleUserStatus(id, isActive, performerId);
      res.status(200).json({
        status: 'success',
        message: `User account has been ${isActive ? 'activated' : 'deactivated'}`,
        data: { user: updatedUser }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const performerId = req.user.id;
      const { id } = req.params;
      await adminService.deleteUser(id, performerId);
      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleStoreStatus(req, res, next) {
    try {
      const performerId = req.user.id;
      const { id } = req.params;
      const { isActive } = req.body;
      const updatedStore = await adminService.toggleStoreStatus(id, isActive, performerId);
      res.status(200).json({
        status: 'success',
        message: `Store has been ${isActive ? 'activated' : 'deactivated'}`,
        data: { store: updatedStore }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteStore(req, res, next) {
    try {
      const performerId = req.user.id;
      const { id } = req.params;
      await adminService.deleteStore(id, performerId);
      res.status(200).json({
        status: 'success',
        message: 'Store deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
