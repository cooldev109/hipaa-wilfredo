import api from './api';

export async function listEvaluationsApi({ status, page = 1, limit = 25 } = {}) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  params.append('page', page);
  params.append('limit', limit);
  const response = await api.get(`/evaluations?${params.toString()}`);
  return response.data;
}

export async function getEvaluationApi(id) {
  const response = await api.get(`/evaluations/${id}`);
  return response.data;
}

export async function createEvaluationApi(patientId, evaluationDate) {
  const response = await api.post('/evaluations', { patientId, evaluationDate });
  return response.data;
}

export async function updateEvaluationApi(id, data) {
  const response = await api.put(`/evaluations/${id}`, data);
  return response.data;
}

export async function autoSaveEvaluationApi(id, data) {
  const response = await api.patch(`/evaluations/${id}/auto-save`, data);
  return response.data;
}

export async function changeEvaluationStatusApi(id, status) {
  const response = await api.patch(`/evaluations/${id}/status`, { status });
  return response.data;
}

export async function deleteEvaluationApi(id) {
  const response = await api.delete(`/evaluations/${id}`);
  return response.data;
}

export async function listPatientEvaluationsApi(patientId) {
  const response = await api.get(`/patients/${patientId}/evaluations`);
  return response.data;
}
