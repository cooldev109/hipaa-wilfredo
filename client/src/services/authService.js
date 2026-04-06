import api from './api';

export async function loginApi(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function logoutApi() {
  const response = await api.post('/auth/logout');
  return response.data;
}

export async function refreshApi() {
  const response = await api.post('/auth/refresh');
  return response.data;
}

export async function getMeApi() {
  const response = await api.get('/auth/me');
  return response.data;
}

export async function changePasswordApi(oldPassword, newPassword) {
  const response = await api.post('/auth/change-password', { oldPassword, newPassword });
  return response.data;
}
