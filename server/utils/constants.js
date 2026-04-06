const ROLES = {
  DOCTOR: 'doctor',
  ASSISTANT: 'assistant',
  SECRETARY: 'secretary'
};

const EVALUATION_STATUS = {
  DRAFT: 'draft',
  COMPLETE: 'complete',
  SIGNED: 'signed'
};

const REPORT_STATUS = {
  DRAFT: 'draft',
  FINAL: 'final',
  SIGNED: 'signed'
};

const AUDIT_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  FAILED_LOGIN: 'FAILED_LOGIN',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PATIENT_CREATE: 'PATIENT_CREATE',
  PATIENT_READ: 'PATIENT_READ',
  PATIENT_UPDATE: 'PATIENT_UPDATE',
  PATIENT_DELETE: 'PATIENT_DELETE',
  EVALUATION_CREATE: 'EVALUATION_CREATE',
  EVALUATION_READ: 'EVALUATION_READ',
  EVALUATION_UPDATE: 'EVALUATION_UPDATE',
  EVALUATION_DELETE: 'EVALUATION_DELETE',
  EVALUATION_STATUS_CHANGE: 'EVALUATION_STATUS_CHANGE',
  REPORT_GENERATE: 'REPORT_GENERATE',
  REPORT_DOWNLOAD: 'REPORT_DOWNLOAD',
  REPORT_SIGN: 'REPORT_SIGN',
  REPORT_VIEW: 'REPORT_VIEW',
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_ROLE_CHANGE: 'USER_ROLE_CHANGE',
  USER_DEACTIVATE: 'USER_DEACTIVATE'
};

const ICD10_CODES = [
  { code: 'H55.81', name: 'Disfunción Oculomotora', nameEn: 'Oculomotor Dysfunction' },
  { code: 'H52.533', name: 'Insuficiencia de Acomodación', nameEn: 'Accommodative Insufficiency' },
  { code: 'H51.11', name: 'Insuficiencia de Convergencia', nameEn: 'Convergence Insufficiency' },
  { code: 'H51.12', name: 'Exceso de Convergencia', nameEn: 'Convergence Excess' },
  { code: 'H52.13', name: 'Miopía', nameEn: 'Myopia' },
  { code: 'H52.03', name: 'Hipermetropía', nameEn: 'Hyperopia' },
  { code: 'H52.23', name: 'Astigmatismo', nameEn: 'Astigmatism' }
];

module.exports = {
  ROLES,
  EVALUATION_STATUS,
  REPORT_STATUS,
  AUDIT_ACTIONS,
  ICD10_CODES
};
