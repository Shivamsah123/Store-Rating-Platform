const userRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthorizedError, ConflictError } = require('../utils/customErrors');
const auditLogService = require('./auditLog.service');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_store_rating_jwt_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthService {
  async register(userData) {
    const { name, email, password, address, role } = userData;

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email address already in use');
    }

    // Force default role to USER if register endpoint is used directly
    // (Admin has a separate route to create store owners/admins)
    const finalRole = role || 'USER';

    const newUser = await userRepository.create({
      name,
      email,
      password,
      address,
      role: finalRole
    });

    // Write audit log for registration
    await auditLogService.log('USER_CREATION', newUser.id, newUser.id, {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      method: 'Self-Registration'
    });

    const token = this.generateToken(newUser);
    return {
      token,
      user: newUser
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated. Please contact support.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user);
    return {
      token,
      user
    };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    await auditLogService.log('USER_PASSWORD_CHANGE', userId, userId, {
      message: 'Password changed successfully'
    });

    return { message: 'Password changed successfully' };
  }
}

module.exports = new AuthService();
