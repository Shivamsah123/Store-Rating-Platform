const { Store, User, Rating } = require('../models');
const { Sequelize } = require('sequelize');

class StoreRepository {
  async findById(id) {
    return Store.findByPk(id, {
      include: [{ model: User, as: 'owner' }]
    });
  }

  async create(storeData) {
    return Store.create(storeData);
  }

  async findAndCountAll(options) {
    return Store.findAndCountAll(options);
  }

  async getStoreWithAverageRating(storeId) {
    return Store.findOne({
      where: { id: storeId },
      attributes: {
        include: [
          [Sequelize.fn('COALESCE', Sequelize.fn('AVG', Sequelize.col('ratings.rating')), 0), 'averageRating'],
          [Sequelize.fn('COUNT', Sequelize.col('ratings.id')), 'totalRatings']
        ]
      },
      include: [
        { model: User, as: 'owner' },
        { model: Rating, as: 'ratings', attributes: [] }
      ],
      group: ['Store.id', 'owner.id']
    });
  }
}

module.exports = new StoreRepository();
