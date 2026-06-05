const { User, Store } = require('../models');

class UserRepository {
  async findById(id, includeStores = false) {
    const options = {};
    if (includeStores) {
      options.include = [{ model: Store, as: 'ownedStores' }];
    }
    return User.findByPk(id, options);
  }

  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async create(userData) {
    return User.create(userData);
  }

  async findAndCountAll(options) {
    return User.findAndCountAll(options);
  }
}

module.exports = new UserRepository();
