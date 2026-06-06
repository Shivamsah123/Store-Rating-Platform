const storeOwnerService = require('../services/storeOwner.service');

class StoreOwnerController {
  async getDashboard(req, res, next) {
    try {
      const ownerId = req.user.id;
      const result = await storeOwnerService.getDashboard(ownerId);
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
      const ownerId = req.user.id;
      const result = await storeOwnerService.getRatings(ownerId, req.query);
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
      const ownerId = req.user.id;
      const result = await storeOwnerService.getStores(ownerId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StoreOwnerController();
