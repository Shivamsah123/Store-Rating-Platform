const ratingService = require('../services/rating.service');

class RatingController {
  async submitRating(req, res, next) {
    try {
      const userId = req.user.id;
      const { storeId, rating, comment } = req.body;
      const newRating = await ratingService.submitRating(userId, parseInt(storeId, 10), rating, comment);
      res.status(201).json({
        status: 'success',
        message: 'Rating submitted successfully',
        data: {
          rating: newRating
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRating(req, res, next) {
    try {
      const userId = req.user.id;
      const { storeId } = req.params;
      const { rating, comment } = req.body;
      const updatedRating = await ratingService.updateRating(userId, parseInt(storeId, 10), rating, comment);
      res.status(200).json({
        status: 'success',
        message: 'Rating updated successfully',
        data: {
          rating: updatedRating
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RatingController();
