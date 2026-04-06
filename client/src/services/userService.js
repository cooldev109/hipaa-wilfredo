import api from './api';

export async function listUsersApi() {
  const response = await api.get('/users');
  return response.data;
}

export async function createUserApi(userData) {
  const response = await api.post('/users', userData);
  return response.data;
}

export async function updateUserApi(id, userData) {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
}

export async function deactivateUserApi(id) {
  const response = await api.patch(`/users/${id}/deactivate`);
  return response.data;
}

export async function changeRoleApi(id, role) {
  const response = await api.patch(`/users/${id}/role`, { role });
  return response.data;
}
