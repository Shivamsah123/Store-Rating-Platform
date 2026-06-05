const { Rating, User, Store } = require('../models');

class RatingRepository {
  async findById(id) {
    return Rating.findByPk(id, {
      include: [
        { model: User, as: 'user' },
        { model: Store, as: 'store' }
      ]
    });
  }

  async findOne(options) {
    return Rating.findOne(options);
  }

  async create(ratingData) {
    return Rating.create(ratingData);
  }

  async findAndCountAll(options) {
    return Rating.findAndCountAll(options);
  }

  async update(id, ratingData) {
    const rating = await Rating.findByPk(id);
    if (!rating) return null;
    return rating.update(ratingData);
  }

  async findByUserAndStore(userId, storeId) {
    return Rating.findOne({
      where: { userId, storeId }
    });
  }
}

module.exports = new RatingRepository();
