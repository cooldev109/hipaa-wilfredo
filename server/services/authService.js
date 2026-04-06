const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/environment');
const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');
const auditLogModel = require('../models/auditLogModel');
const { AUDIT_ACTIONS } = require('../utils/constants');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

async function login(email, password, ipAddress, userAgent) {
  const user = await userModel.findByEmail(email);

  if (!user) {
    await auditLogModel.create({
      action: AUDIT_ACTIONS.FAILED_LOGIN,
      ipAddress,
      userAgent,
      details: { email, reason: 'user_not_found' }
    });
    throw { status: 401, errorCode: 'INVALID_CREDENTIALS' };
  }

  if (!user.is_active) {
    await auditLogModel.create({
      userId: user.id,
      userEmail: user.email,
      action: AUDIT_ACTIONS.FAILED_LOGIN,
      ipAddress,
      userAgent,
      details: { reason: 'account_inactive' }
    });
    throw { status: 401, errorCode: 'ACCOUNT_INACTIVE' };
  }

  // Check lockout
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const remainingMs = new Date(user.locked_until) - new Date();
    const remainingMin = Math.ceil(remainingMs / 60000);
    await auditLogModel.create({
      userId: user.id,
      userEmail: user.email,
      action: AUDIT_ACTIONS.FAILED_LOGIN,
      ipAddress,
      userAgent,
      details: { reason: 'account_locked', remaining_minutes: remainingMin }
    });
    throw { status: 429, errorCode: 'ACCOUNT_LOCKED', remainingMin };
  }

  const passwordValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordValid) {
    const newAttempts = user.failed_login_attempts + 1;
    let lockedUntil = null;

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
    }

    await userModel.updateLoginAttempts(email, newAttempts, lockedUntil);

    await auditLogModel.create({
      userId: user.id,
      userEmail: user.email,
      action: AUDIT_ACTIONS.FAILED_LOGIN,
      ipAddress,
      userAgent,
      details: { reason: 'invalid_password', attempts: newAttempts }
    });

    if (lockedUntil) {
      throw { status: 429, errorCode: 'ACCOUNT_LOCKED', remainingMin: LOCKOUT_MINUTES };
    }

    throw { status: 401, errorCode: 'INVALID_CREDENTIALS' };
  }

  // Reset failed attempts on success
  await userModel.resetLoginAttempts(email);
  await userModel.updateLastLogin(user.id);

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  // Store refresh token
  const refreshExpiresAt = new Date(Date.now() + env.jwt.refreshExpiresInDays * 24 * 60 * 60 * 1000);
  await refreshTokenModel.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: refreshExpiresAt,
    ipAddress,
    userAgent
  });

  await auditLogModel.create({
    userId: user.id,
    userEmail: user.email,
    action: AUDIT_ACTIONS.LOGIN,
    ipAddress,
    userAgent
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      licenseNumber: user.license_number,
      forcePasswordChange: user.force_password_change
    }
  };
}

async function refresh(refreshToken, ipAddress, userAgent) {
  const storedToken = await refreshTokenModel.findByToken(refreshToken);

  if (!storedToken) {
    throw { status: 401, errorCode: 'INVALID_REFRESH_TOKEN' };
  }

  // Revoke old token (single-use rotation)
  await refreshTokenModel.revoke(refreshToken);

  const user = await userModel.findById(storedToken.user_id);

  if (!user || !user.is_active) {
    throw { status: 401, errorCode: 'USER_NOT_FOUND' };
  }

  // Generate new pair
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken();

  const refreshExpiresAt = new Date(Date.now() + env.jwt.refreshExpiresInDays * 24 * 60 * 60 * 1000);
  await refreshTokenModel.create({
    userId: user.id,
    token: newRefreshToken,
    expiresAt: refreshExpiresAt,
    ipAddress,
    userAgent
  });

  await auditLogModel.create({
    userId: user.id,
    userEmail: user.email,
    action: AUDIT_ACTIONS.TOKEN_REFRESH,
    ipAddress,
    userAgent
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

async function logout(refreshToken, userId, userEmail, ipAddress, userAgent) {
  if (refreshToken) {
    await refreshTokenModel.revoke(refreshToken);
  }

  await auditLogModel.create({
    userId,
    userEmail,
    action: AUDIT_ACTIONS.LOGOUT,
    ipAddress,
    userAgent
  });
}

async function changePassword(userId, userEmail, oldPassword, newPassword, ipAddress, userAgent) {
  const user = await userModel.findByEmail(userEmail);

  if (!user) {
    throw { status: 404, errorCode: 'USER_NOT_FOUND' };
  }

  const oldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
  if (!oldPasswordValid) {
    throw { status: 401, errorCode: 'WRONG_CURRENT_PASSWORD' };
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await userModel.updatePassword(userId, newHash);

  // Revoke all refresh tokens (force re-login on other sessions)
  await refreshTokenModel.revokeAllForUser(userId);

  await auditLogModel.create({
    userId,
    userEmail,
    action: AUDIT_ACTIONS.PASSWORD_CHANGE,
    ipAddress,
    userAgent
  });
}

async function getProfile(userId) {
  const user = await userModel.findById(userId);
  if (!user) {
    throw { status: 404, errorCode: 'USER_NOT_FOUND' };
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    licenseNumber: user.license_number,
    forcePasswordChange: user.force_password_change
  };
}

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn }
  );
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

module.exports = { login, refresh, logout, changePassword, getProfile };
