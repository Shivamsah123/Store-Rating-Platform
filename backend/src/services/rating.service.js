const ratingRepository = require('../repositories/rating.repository');
const storeRepository = require('../repositories/store.repository');
const { BadRequestError, NotFoundError } = require('../utils/customErrors');
const auditLogService = require('./auditLog.service');

class RatingService {
  normalizeComment(comment) {
    if (comment === undefined || comment === null) return null;
    const trimmed = String(comment).trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  async submitRating(userId, storeId, ratingValue, comment) {
    // Verify store exists
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    if (!store.isActive) {
      throw new BadRequestError('This store is inactive and cannot receive new ratings');
    }

    // Verify rating value is valid
    if (ratingValue < 1 || ratingValue > 5) {
      throw new BadRequestError('Rating must be between 1 and 5');
    }

    // Check if user already rated this store
    const existingRating = await ratingRepository.findByUserAndStore(userId, storeId);
    if (existingRating) {
      throw new BadRequestError('You have already rated this store. Please update your existing rating instead.');
    }

    const normalizedComment = this.normalizeComment(comment);

    const newRating = await ratingRepository.create({
      userId,
      storeId,
      rating: ratingValue,
      comment: normalizedComment
    });

    await auditLogService.log('RATING_SUBMISSION', userId, newRating.id, {
      storeId,
      rating: ratingValue,
      hasComment: Boolean(normalizedComment)
    });

    return newRating;
  }

  async updateRating(userId, storeId, ratingValue, comment) {
    // Verify store exists and is active
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    if (!store.isActive) {
      throw new BadRequestError('This store is inactive and cannot receive rating updates');
    }

    // Verify rating value is valid
    if (ratingValue < 1 || ratingValue > 5) {
      throw new BadRequestError('Rating must be between 1 and 5');
    }

    // Check if user has rated this store
    const rating = await ratingRepository.findByUserAndStore(userId, storeId);
    if (!rating) {
      throw new NotFoundError('No existing rating found for this store');
    }

    const normalizedComment = this.normalizeComment(comment);

    await rating.update({
      rating: ratingValue,
      comment: normalizedComment
    });
    await rating.reload();

    await auditLogService.log('RATING_UPDATE', userId, rating.id, {
      storeId,
      rating: ratingValue,
      hasComment: Boolean(normalizedComment)
    });

    return rating;
  }
}

module.exports = new RatingService();
