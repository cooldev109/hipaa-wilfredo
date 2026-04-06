const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const auditLogModel = require('../models/auditLogModel');
const { AUDIT_ACTIONS, ROLES } = require('../utils/constants');

const VALID_ROLES = [ROLES.DOCTOR, ROLES.ASSISTANT, ROLES.SECRETARY];

async function createUser({ email, password, firstName, lastName, role, licenseNumber }, createdBy, ipAddress, userAgent) {
  if (!VALID_ROLES.includes(role)) {
    throw { status: 400, errorCode: 'INVALID_ROLE' };
  }

  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw { status: 409, errorCode: 'EMAIL_ALREADY_EXISTS' };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await userModel.create({
    email,
    passwordHash,
    firstName,
    lastName,
    role,
    licenseNumber,
    createdBy
  });

  await auditLogModel.create({
    userId: createdBy,
    action: AUDIT_ACTIONS.USER_CREATE,
    resource: 'users',
    resourceId: user.id,
    ipAddress,
    userAgent,
    details: { email, role }
  });

  return user;
}

async function listUsers() {
  const users = await userModel.findAll();
  return users.map(formatUser);
}

async function updateUser(id, { firstName, lastName, email, licenseNumber }, updatedBy, ipAddress, userAgent) {
  const existing = await userModel.findById(id);
  if (!existing) {
    throw { status: 404, errorCode: 'USER_NOT_FOUND' };
  }

  // Check email uniqueness if changed
  if (email !== existing.email) {
    const emailTaken = await userModel.findByEmail(email);
    if (emailTaken) {
      throw { status: 409, errorCode: 'EMAIL_ALREADY_EXISTS' };
    }
  }

  const user = await userModel.update(id, { firstName, lastName, email, licenseNumber });

  await auditLogModel.create({
    userId: updatedBy,
    action: AUDIT_ACTIONS.USER_UPDATE,
    resource: 'users',
    resourceId: id,
    ipAddress,
    userAgent,
    details: { fields_modified: ['firstName', 'lastName', 'email', 'licenseNumber'] }
  });

  return user;
}

async function deactivateUser(id, deactivatedBy, ipAddress, userAgent) {
  if (id === deactivatedBy) {
    throw { status: 400, errorCode: 'CANNOT_DEACTIVATE_SELF' };
  }

  const user = await userModel.deactivate(id);
  if (!user) {
    throw { status: 404, errorCode: 'USER_NOT_FOUND' };
  }

  await auditLogModel.create({
    userId: deactivatedBy,
    action: AUDIT_ACTIONS.USER_DEACTIVATE,
    resource: 'users',
    resourceId: id,
    ipAddress,
    userAgent
  });

  return user;
}

async function changeRole(id, role, changedBy, ipAddress, userAgent) {
  if (!VALID_ROLES.includes(role)) {
    throw { status: 400, errorCode: 'INVALID_ROLE' };
  }

  if (id === changedBy) {
    throw { status: 400, errorCode: 'CANNOT_CHANGE_OWN_ROLE' };
  }

  const user = await userModel.updateRole(id, role);
  if (!user) {
    throw { status: 404, errorCode: 'USER_NOT_FOUND' };
  }

  await auditLogModel.create({
    userId: changedBy,
    action: AUDIT_ACTIONS.USER_ROLE_CHANGE,
    resource: 'users',
    resourceId: id,
    ipAddress,
    userAgent,
    details: { new_role: role }
  });

  return user;
}

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    licenseNumber: user.license_number,
    isActive: user.is_active,
    forcePasswordChange: user.force_password_change,
    lastLoginAt: user.last_login_at,
    createdAt: user.created_at
  };
}

module.exports = { createUser, listUsers, updateUser, deactivateUser, changeRole };
