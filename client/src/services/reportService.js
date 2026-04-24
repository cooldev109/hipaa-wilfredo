import api from './api';

export async function generateReportApi(evaluationId, conditionBlocks, font) {
  const response = await api.post('/reports/generate', { evaluationId, conditionBlocks, font });
  return response.data;
}

export async function getReportApi(id) {
  const response = await api.get(`/reports/${id}`);
  return response.data;
}

export async function downloadReportApi(id) {
  const response = await api.get(`/reports/${id}/download`, { responseType: 'blob' });
  return response.data;
}

export async function listReportsApi({ page = 1, limit = 25 } = {}) {
  const response = await api.get(`/reports?page=${page}&limit=${limit}`);
  return response.data;
}

export async function listEvaluationReportsApi(evaluationId) {
  const response = await api.get(`/reports/evaluation/${evaluationId}`);
  return response.data;
}

export async function signDoctorApi(reportId, signatureData) {
  const response = await api.post(`/reports/${reportId}/sign/doctor`, { signatureData });
  return response.data;
}

export async function signParentApi(reportId, signatureData, signerName) {
  const response = await api.post(`/reports/${reportId}/sign/parent`, { signatureData, signerName });
  return response.data;
}
