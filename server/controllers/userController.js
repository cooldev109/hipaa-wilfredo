const userService = require('../services/userService');

async function createUser(req, res, next) {
  try {
    const { email, password, firstName, lastName, role, licenseNumber } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ success: false, errorCode: 'USER_REQUIRED_FIELDS' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, errorCode: 'PASSWORD_TOO_SHORT' });
    }

    const user = await userService.createUser(
      { email, password, firstName, lastName, role, licenseNumber },
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );

    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ success: false, errorCode: err.errorCode || err.message });
    }
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    return res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, licenseNumber } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, errorCode: 'USER_REQUIRED_FIELDS' });
    }

    const user = await userService.updateUser(
      id,
      { firstName, lastName, email, licenseNumber },
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );

    return res.json({ success: true, data: user });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ success: false, errorCode: err.errorCode || err.message });
    }
    next(err);
  }
}

async function deactivateUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.deactivateUser(
      id,
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );
    return res.json({ success: true, data: user });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ success: false, errorCode: err.errorCode || err.message });
    }
    next(err);
  }
}

async function changeRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, errorCode: 'ROLE_REQUIRED' });
    }

    const user = await userService.changeRole(
      id,
      role,
      req.user.userId,
      req.ip,
      req.get('User-Agent')
    );

    return res.json({ success: true, data: user });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ success: false, errorCode: err.errorCode || err.message });
    }
    next(err);
  }
}

module.exports = { createUser, listUsers, updateUser, deactivateUser, changeRole };
