const storeService = require('../services/store.service');

class StoreController {
  async getStores(req, res, next) {
    try {
      // If user is authenticated, we pass their ID to fetch their individual rating
      const currentUserId = req.user ? req.user.id : null;
      const result = await storeService.getStoresForUser(req.query, currentUserId);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getStoreReviews(req, res, next) {
    try {
      const { storeId } = req.params;
      const result = await storeService.getStoreReviews(storeId, req.query);
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StoreController();
