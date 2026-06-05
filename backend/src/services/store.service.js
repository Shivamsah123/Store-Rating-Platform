const { Op, Sequelize } = require('sequelize');
const storeRepository = require('../repositories/store.repository');
const { User, Rating, Store } = require('../models');
const { NotFoundError } = require('../utils/customErrors');

class StoreService {
  async getStoresForUser(query, currentUserId) {
    const { page = 1, limit = 10, search = '', name = '', address = '', sortField = 'name', sortOrder = 'ASC' } = query;
    const pageSize = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageSize;

    const where = { isActive: true };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (address) {
      where.address = { [Op.like]: `%${address}%` };
    }

    const includeAttributes = [
      [
        Sequelize.literal(`(
          SELECT COALESCE(AVG(rating), 0)
          FROM ratings AS r
          WHERE r.store_id = Store.id
        )`),
        'averageRating'
      ],
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM ratings AS r
          WHERE r.store_id = Store.id
        )`),
        'totalRatings'
      ]
    ];

    if (currentUserId) {
      includeAttributes.push([
        Sequelize.literal(`(
          SELECT rating
          FROM ratings AS r
          WHERE r.store_id = Store.id AND r.user_id = ${parseInt(currentUserId)}
          LIMIT 1
        )`),
        'currentUserRating'
      ]);
      includeAttributes.push([
        Sequelize.literal(`(
          SELECT comment
          FROM ratings AS r
          WHERE r.store_id = Store.id AND r.user_id = ${parseInt(currentUserId)}
          LIMIT 1
        )`),
        'currentUserComment'
      ]);
    }

    const { count, rows } = await storeRepository.findAndCountAll({
      where,
      attributes: {
        include: includeAttributes
      },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
      ],
      limit: pageSize,
      offset,
      order: sortField === 'averageRating' 
        ? [[Sequelize.literal('averageRating'), sortOrder]] 
        : [[sortField, sortOrder]]
    });

    return {
      stores: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: parseInt(page),
        limit: pageSize
      }
    };
  }

  async getStoreReviews(storeId, query = {}) {
    const { page = 1, limit = 10 } = query;
    const pageSize = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageSize;

    const store = await Store.findByPk(storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    const { count, rows } = await Rating.findAndCountAll({
      where: { storeId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset
    });

    return {
      store: { id: store.id, name: store.name },
      reviews: rows.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment || null,
        userName: r.user ? r.user.name : 'Anonymous User',
        userEmail: r.user ? r.user.email : '',
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      })),
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: parseInt(page),
        limit: pageSize
      }
    };
  }
}

module.exports = new StoreService();
