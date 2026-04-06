import api from './api';

export async function listPatientsApi({ search, school, grade, page = 1, limit = 25 } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (school) params.append('school', school);
  if (grade) params.append('grade', grade);
  params.append('page', page);
  params.append('limit', limit);

  const response = await api.get(`/patients?${params.toString()}`);
  return response.data;
}

export async function getPatientApi(id) {
  const response = await api.get(`/patients/${id}`);
  return response.data;
}

export async function createPatientApi(data) {
  const response = await api.post('/patients', data);
  return response.data;
}

export async function updatePatientApi(id, data) {
  const response = await api.put(`/patients/${id}`, data);
  return response.data;
}

export async function updatePatientHistoryApi(id, data) {
  const response = await api.put(`/patients/${id}/history`, data);
  return response.data;
}

export async function deletePatientApi(id) {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
}
