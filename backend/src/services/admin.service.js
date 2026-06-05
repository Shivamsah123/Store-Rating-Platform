const { Op, Sequelize } = require('sequelize');
const userRepository = require('../repositories/user.repository');
const storeRepository = require('../repositories/store.repository');
const ratingRepository = require('../repositories/rating.repository');
const auditLogService = require('./auditLog.service');
const { User, Store, Rating } = require('../models');
const { BadRequestError, NotFoundError } = require('../utils/customErrors');

class AdminService {
  async getDashboard(performerId) {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    // Calculate average rating across all stores
    const avgResult = await Rating.findOne({
      attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']]
    });
    const avgRating = parseFloat(avgResult?.getDataValue('avgRating') || 0).toFixed(2);

    // Fetch growth analytics (count grouped by date for the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
    });

    const storeGrowth = await Store.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
    });

    const ratingGrowth = await Rating.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']]
    });

    return {
      totalUsers,
      totalStores,
      totalRatings,
      avgRating,
      analytics: {
        users: userGrowth.map(item => ({ date: item.getDataValue('date'), count: parseInt(item.getDataValue('count')) })),
        stores: storeGrowth.map(item => ({ date: item.getDataValue('date'), count: parseInt(item.getDataValue('count')) })),
        ratings: ratingGrowth.map(item => ({ date: item.getDataValue('date'), count: parseInt(item.getDataValue('count')) }))
      }
    };
  }

  async createUser(userData, performerId) {
    const { name, email, password, address, role } = userData;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Email address already in use');
    }

    const newUser = await userRepository.create({
      name,
      email,
      password,
      address,
      role
    });

    await auditLogService.log('USER_CREATION', performerId, newUser.id, {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      method: 'Admin-Created'
    });

    return newUser;
  }

  async createStore(storeData, performerId) {
    const { name, email, address, ownerId } = storeData;

    // Verify owner exists and has STORE_OWNER role
    const owner = await userRepository.findById(ownerId);
    if (!owner) {
      throw new NotFoundError('Owner user not found');
    }
    if (owner.role !== 'STORE_OWNER') {
      throw new BadRequestError('Selected owner must have STORE_OWNER role');
    }

    // Check if store email is in use
    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      throw new BadRequestError('Store email already in use');
    }

    const newStore = await storeRepository.create({
      name,
      email,
      address,
      ownerId
    });

    await auditLogService.log('STORE_CREATION', performerId, newStore.id, {
      name: newStore.name,
      email: newStore.email,
      ownerId: newStore.ownerId
    });

    return newStore;
  }

  async getUsers(query) {
    const { page = 1, limit = 10, search = '', role = '', name = '', email = '', address = '', sortField = 'createdAt', sortOrder = 'DESC' } = query;
    const pageSize = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageSize;

    const where = {};
    if (role) {
      where.role = role;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const { count, rows } = await userRepository.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [[sortField, sortOrder]]
    });

    return {
      users: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: parseInt(page),
        limit: pageSize
      }
    };
  }

  async getStores(query) {
    const { page = 1, limit = 10, search = '', name = '', email = '', address = '', sortField = 'createdAt', sortOrder = 'DESC' } = query;
    const pageSize = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageSize;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ];
    }

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    // Use subqueries for averageRating and totalRatings to make sorting and paginating precise
    const { count, rows } = await storeRepository.findAndCountAll({
      where,
      attributes: {
        include: [
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
        ]
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

  async getUserDetails(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const details = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    if (user.role === 'USER') {
      const ratings = await Rating.findAll({
        where: { userId: user.id },
        include: [
          { model: Store, as: 'store', attributes: ['id', 'name', 'address'] }
        ],
        order: [['createdAt', 'DESC']]
      });
      details.ratings = ratings.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment || null,
        storeId: r.storeId,
        storeName: r.store ? r.store.name : 'Unknown Store',
        storeAddress: r.store ? r.store.address : '',
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }));
    }

    if (user.role === 'STORE_OWNER') {
      // Fetch stores owned by this user, along with average ratings
      const stores = await Store.findAll({
        where: { ownerId: user.id },
        attributes: {
          include: [
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
          ]
        }
      });
      details.stores = stores;
    }

    return details;
  }

  async getRatings(query) {
    const { page = 1, limit = 10, search = '', storeId = '', userId = '' } = query;
    const pageSize = parseInt(limit);
    const offset = (parseInt(page) - 1) * pageSize;

    const where = {};
    if (storeId) where.storeId = parseInt(storeId);
    if (userId) where.userId = parseInt(userId);

    if (search) {
      where[Op.or] = [
        { comment: { [Op.like]: `%${search}%` } },
        Sequelize.where(Sequelize.col('user.name'), { [Op.like]: `%${search}%` }),
        Sequelize.where(Sequelize.col('user.email'), { [Op.like]: `%${search}%` }),
        Sequelize.where(Sequelize.col('store.name'), { [Op.like]: `%${search}%` }),
        Sequelize.where(Sequelize.col('store.email'), { [Op.like]: `%${search}%` })
      ];
    }

    const { count, rows } = await Rating.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Store, as: 'store', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset,
      subQuery: false,
      distinct: true
    });

    return {
      ratings: rows.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment || null,
        userId: r.userId,
        userName: r.user ? r.user.name : 'Unknown User',
        userEmail: r.user ? r.user.email : '',
        storeId: r.storeId,
        storeName: r.store ? r.store.name : 'Unknown Store',
        storeEmail: r.store ? r.store.email : '',
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

  async globalSearch(searchTerm) {
    if (!searchTerm) {
      return { users: [], stores: [] };
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      limit: 10
    });

    const stores = await Store.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COALESCE(AVG(rating), 0)
              FROM ratings AS r
              WHERE r.store_id = Store.id
            )`),
            'averageRating'
          ]
        ]
      },
      limit: 10
    });

    return { users, stores };
  }

  async toggleUserStatus(userId, isActive, performerId) {
    if (parseInt(userId) === parseInt(performerId)) {
      throw new BadRequestError('You cannot deactivate your own admin account');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.isActive = isActive;
    await user.save();

    await auditLogService.log('USER_STATUS_CHANGE', performerId, user.id, {
      name: user.name,
      email: user.email,
      isActive
    });

    return user;
  }

  async deleteUser(userId, performerId) {
    if (parseInt(userId) === parseInt(performerId)) {
      throw new BadRequestError('You cannot delete your own admin account');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Cascade delete: If the user is a STORE_OWNER, delete their stores
    if (user.role === 'STORE_OWNER') {
      const stores = await Store.findAll({ where: { ownerId: user.id } });
      for (const store of stores) {
        // Delete all ratings for this store first
        await Rating.destroy({ where: { storeId: store.id } });
        // Delete store
        await store.destroy();
        
        await auditLogService.log('STORE_DELETION', performerId, store.id, {
          name: store.name,
          email: store.email,
          reason: 'Owner deleted'
        });
      }
    }

    // Delete ratings submitted by this user
    await Rating.destroy({ where: { userId: user.id } });

    // Delete user
    await User.destroy({ where: { id: user.id } });

    await auditLogService.log('USER_DELETION', performerId, user.id, {
      name: user.name,
      email: user.email,
      role: user.role
    });
  }

  async toggleStoreStatus(storeId, isActive, performerId) {
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    store.isActive = isActive;
    await store.save();

    await auditLogService.log('STORE_STATUS_CHANGE', performerId, store.id, {
      name: store.name,
      email: store.email,
      isActive
    });

    return store;
  }

  async deleteStore(storeId, performerId) {
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new NotFoundError('Store not found');
    }

    // Delete all ratings for this store
    await Rating.destroy({ where: { storeId: store.id } });

    // Delete store
    await Store.destroy({ where: { id: store.id } });

    await auditLogService.log('STORE_DELETION', performerId, store.id, {
      name: store.name,
      email: store.email
    });
  }
}

module.exports = new AdminService();
