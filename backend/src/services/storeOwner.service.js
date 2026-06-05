const { Op, Sequelize } = require('sequelize');
const { Store, Rating, User } = require('../models');

class StoreOwnerService {
  async getDashboard(ownerId) {
    // Find all stores owned by this owner
    const stores = await Store.findAll({
      where: { ownerId }
    });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        storesCount: 0
      };
    }

    // Calculate aggregated ratings metrics
    const stats = await Rating.findOne({
      where: {
        storeId: {
          [Op.in]: storeIds
        }
      },
      attributes: [
        [Sequelize.fn('COALESCE', Sequelize.fn('AVG', Sequelize.col('rating')), 0), 'averageRating'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalRatings']
      ],
      raw: true
    });

    // Fetch rating distribution (how many 5s, 4s, 3s, etc.)
    const distribution = await Rating.findAll({
      where: {
        storeId: {
          [Op.in]: storeIds
        }
      },
      attributes: [
        'rating',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    const distributionMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distribution.forEach(d => {
      distributionMap[d.rating] = parseInt(d.count);
    });

    return {
      averageRating: parseFloat(parseFloat(stats.averageRating).toFixed(2)),
      totalRatings: parseInt(stats.totalRatings),
      storesCount: stores.length,
      distribution: distributionMap
    };
  }

  async getRatings(ownerId) {
    const stores = await Store.findAll({
      where: { ownerId }
    });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return [];
    }

    const ratings = await Rating.findAll({
      where: {
        storeId: {
          [Op.in]: storeIds
        }
      },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Store, as: 'store', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return ratings.map(r => ({
      id: r.id,
      userName: r.user ? r.user.name : 'Anonymous User',
      userEmail: r.user ? r.user.email : '',
      storeName: r.store ? r.store.name : 'Unknown Store',
      storeId: r.storeId,
      rating: r.rating,
      comment: r.comment || null,
      createdAt: r.createdAt
    }));
  }
}

module.exports = new StoreOwnerService();
