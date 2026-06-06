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

  async getRatings(ownerId, query = {}) {
    const { search = '', rating, sortField = 'createdAt', sortOrder = 'DESC' } = query;

    const stores = await Store.findAll({
      where: { ownerId }
    });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return [];
    }

    const where = {
      storeId: {
        [Op.in]: storeIds
      }
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    const include = [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
    ];

    // If searching by store name, include Store with a where clause
    if (search && search.trim() !== '') {
      include.push({ model: Store, as: 'store', attributes: ['id', 'name'], where: { name: { [Op.like]: `%${search}%` } } });
    } else {
      include.push({ model: Store, as: 'store', attributes: ['id', 'name'] });
    }

    // Build order
    let order = [];
    if (sortField === 'storeName') {
      order = [[{ model: Store, as: 'store' }, 'name', sortOrder]];
    } else {
      order = [[sortField, sortOrder]];
    }

    const ratings = await Rating.findAll({
      where,
      include,
      order
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

  async getStores(ownerId) {
    const stores = await Store.findAll({
      where: { ownerId },
      attributes: ['id', 'name', 'email', 'address', 'isActive']
    });

    return stores.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      isActive: s.isActive
    }));
  }
}

module.exports = new StoreOwnerService();
