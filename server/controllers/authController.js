const authService = require('../services/authService');
const env = require('../config/environment');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict'
};

function sendError(res, err) {
  const response = { success: false };
  if (err.errorCode) response.errorCode = err.errorCode;
  if (err.remainingMin) response.remainingMin = err.remainingMin;
  return res.status(err.status).json(response);
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, errorCode: 'LOGIN_REQUIRED_FIELDS' });
    }

    const result = await authService.login(email, password, req.ip, req.get('User-Agent'));

    res.cookie('accessToken', result.accessToken, {
      ...COOKIE_OPTIONS,
      path: '/api',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, data: { user: result.user } });
  } catch (err) {
    if (err.status) return sendError(res, err);
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies && req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, errorCode: 'NO_REFRESH_TOKEN' });
    }

    const result = await authService.refresh(refreshToken, req.ip, req.get('User-Agent'));

    res.cookie('accessToken', result.accessToken, {
      ...COOKIE_OPTIONS,
      path: '/api',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true });
  } catch (err) {
    res.clearCookie('accessToken', { path: '/api' });
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    if (err.status) return sendError(res, err);
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies && req.cookies.refreshToken;

    await authService.logout(
      refreshToken,
      req.user.userId,
      req.user.email,
      req.ip,
      req.get('User-Agent')
    );

    res.clearCookie('accessToken', { path: '/api' });
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

    return res.json({ success: true });
  } catch (err) {
    res.clearCookie('accessToken', { path: '/api' });
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    if (err.status) return sendError(res, err);
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, errorCode: 'PASSWORD_REQUIRED' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, errorCode: 'PASSWORD_TOO_SHORT' });
    }

    await authService.changePassword(
      req.user.userId,
      req.user.email,
      oldPassword,
      newPassword,
      req.ip,
      req.get('User-Agent')
    );

    res.clearCookie('accessToken', { path: '/api' });
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

    return res.json({ success: true });
  } catch (err) {
    if (err.status) return sendError(res, err);
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const profile = await authService.getProfile(req.user.userId);
    return res.json({ success: true, data: profile });
  } catch (err) {
    if (err.status) return sendError(res, err);
    next(err);
  }
}

module.exports = { login, refresh, logout, changePassword, me };
