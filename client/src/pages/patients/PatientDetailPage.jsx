import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { getPatientApi, deletePatientApi } from '../../services/patientService';
import { listPatientEvaluationsApi, createEvaluationApi } from '../../services/evaluationService';
import { ArrowLeft, Edit, Trash2, FilePlus, Calendar, User, School, Phone, Mail, Eye, Plus } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';
import dayjs from 'dayjs';

const THERAPY_LABELS = {
  occupational: 'patients.therapy.occupational',
  occupationalSensory: 'patients.therapy.occupationalSensory',
  speech: 'patients.therapy.speech',
  physical: 'patients.therapy.physical',
  educational: 'patients.therapy.educational',
  psychological: 'patients.therapy.psychological',
  functionalVision: 'patients.therapy.functionalVision'
};

export default function PatientDetailPage() {
  const { id } = useParams();
  const { role } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      const data = await getPatientApi(id);
      if (data.success) setPatient(data.data);
    } catch {
      navigate('/pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePatientApi(id);
      toast.success(t('success.deleted'));
      navigate('/pacientes');
    } catch {
      toast.error(t('error.server'));
    }
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return <div style={{ color: 'var(--color-text-muted)', padding: 'var(--space-xl)' }}>{t('common.loading')}</div>;
  }

  if (!patient) return null;

  const activeTherapies = patient.history?.therapies
    ? Object.entries(patient.history.therapies).filter(([, v]) => v).map(([k]) => k)
    : [];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button onClick={() => navigate('/pacientes')} style={backBtnStyle}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1>{patient.firstName} {patient.lastName}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              {patient.age ? `${patient.age.years} ${t('patients.years')}, ${patient.age.months} ${t('patients.months')}` : ''} — {patient.sex === 'M' ? t('patients.male') : t('patients.female')}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button onClick={() => navigate(`/evaluaciones?patientId=${id}`)} style={accentBtnStyle}>
            <FilePlus size={15} /> {t('evaluations.new')}
          </button>
          {role === 'doctor' && (
            <button onClick={() => setShowDeleteConfirm(true)} style={dangerBtnStyle}>
              <Trash2 size={15} /> {t('common.delete')}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Patient Info Card */}
        <Card title={t('patients.personalData')}>
          <InfoRow icon={<User size={14} />} label={t('patients.name')} value={`${patient.firstName} ${patient.lastName}`} />
          <InfoRow icon={<Calendar size={14} />} label={t('patients.dateOfBirth')} value={dayjs(patient.dateOfBirth).format('DD/MM/YYYY')} />
          <InfoRow icon={<School size={14} />} label={t('patients.school')} value={patient.school || '—'} />
          <InfoRow label={t('patients.grade')} value={patient.grade || '—'} />
          <InfoRow label={t('patients.referredBy')} value={patient.referredBy || '—'} />
        </Card>

        {/* Guardian Card */}
        <Card title={t('patients.guardian')}>
          <InfoRow icon={<User size={14} />} label={t('patients.guardianName')} value={patient.parentGuardianName || '—'} />
          <InfoRow icon={<Phone size={14} />} label={t('patients.guardianPhone')} value={patient.parentGuardianPhone || '—'} />
          <InfoRow icon={<Mail size={14} />} label={t('patients.guardianEmail')} value={patient.parentGuardianEmail || '—'} />
        </Card>

        {/* Medical History */}
        <Card title={t('patients.medicalHistory')}>
          <HistoryField label={t('patients.visualHistory')} value={patient.history?.visualHistory} />
          <HistoryField label={t('patients.medHistory')} value={patient.history?.medicalHistory} />
          <HistoryField label={t('patients.medications')} value={patient.history?.medications} />
          <HistoryField label={t('patients.familyOcularHistory')} value={patient.history?.familyOcularHistory} />
          <HistoryField label={t('patients.familyMedHistory')} value={patient.history?.familyMedicalHistory} />
        </Card>

        {/* Developmental + Therapies */}
        <Card title={t('patients.developmental')}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
            <InfoRow label={t('patients.birthWeeks')} value={patient.history?.developmentalBirthWeeks || '—'} />
            <InfoRow label={t('patients.birthType')} value={patient.history?.developmentalBirthType ? t(`patients.${patient.history.developmentalBirthType}`) : '—'} />
            <InfoRow label={t('patients.crawledMonths')} value={patient.history?.developmentalCrawledMonths || '—'} />
            <InfoRow label={t('patients.walkedMonths')} value={patient.history?.developmentalWalkedMonths || '—'} />
            <InfoRow label={t('patients.talkedMonths')} value={patient.history?.developmentalTalkedMonths || '—'} />
          </div>

          {activeTherapies.length > 0 && (
            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)' }}>
              <label style={{ marginBottom: 'var(--space-sm)' }}>{t('patients.therapies')}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {activeTherapies.map((key) => (
                  <span key={key} style={{
                    padding: '2px 10px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-on-primary)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500
                  }}>
                    {t(THERAPY_LABELS[key])}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Evaluations List */}
      <Card title={t('patients.evaluations')} style={{ marginTop: 'var(--space-lg)' }}>
        <EvaluationsList patientId={id} navigate={navigate} t={t} role={role} />
      </Card>

      {showDeleteConfirm && (
        <ConfirmDialog
          title={t('patients.confirmDelete')}
          message={`${patient.firstName} ${patient.lastName} — ${t('patients.deleteWarning') || 'This action cannot be undone.'}`}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          danger
        />
      )}
    </div>
  );
}

function Card({ title, children, style: extraStyle }) {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      padding: 'var(--space-lg)',
      transition: 'var(--transition-theme)',
      ...extraStyle
    }}>
      <h3 style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '4px 0', fontSize: 'var(--text-base)' }}>
      {icon && <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>{icon}</span>}
      <span style={{ color: 'var(--color-text-secondary)', minWidth: '120px', fontSize: 'var(--text-sm)' }}>{label}:</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function HistoryField({ label, value }) {
  return (
    <div style={{ marginBottom: 'var(--space-sm)' }}>
      <label style={{ fontSize: 'var(--text-sm)' }}>{label}</label>
      <p style={{ color: value ? 'var(--color-text)' : 'var(--color-text-muted)', fontSize: 'var(--text-base)', marginTop: '2px' }}>
        {value || '—'}
      </p>
    </div>
  );
}

function EvaluationsList({ patientId, navigate, t, role }) {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadEvaluations();
  }, [patientId]);

  const loadEvaluations = async () => {
    try {
      const data = await listPatientEvaluationsApi(patientId);
      if (data.success) setEvaluations(data.data);
    } catch {
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const data = await createEvaluationApi(patientId, dayjs().format('YYYY-MM-DD'));
      if (data.success) navigate(`/evaluaciones/${data.data.id}`);
    } catch {
      alert(t('error.server'));
    } finally {
      setCreating(false);
    }
  };

  const statusColors = {
    draft: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
    complete: { bg: 'var(--color-info-bg)', color: 'var(--color-info)' },
    signed: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' }
  };

  if (loading) return <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{t('common.loading')}</p>;

  return (
    <div>
      {(role === 'doctor' || role === 'assistant') && (
        <button onClick={handleCreate} disabled={creating} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
          padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-md)',
          backgroundColor: 'var(--color-accent)', color: 'var(--color-text-on-primary)',
          border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          fontSize: 'var(--text-sm)', fontWeight: 500
        }}>
          <Plus size={14} /> {creating ? t('common.loading') : t('evaluations.new')}
        </button>
      )}

      {evaluations.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-lg)' }}>
          {t('patients.noEvaluations')}
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{t('evaluations.date')}</th>
              <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{t('evaluations.status')}</th>
              <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{t('evaluations.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((ev) => {
              const sc = statusColors[ev.status] || statusColors.draft;
              return (
                <tr key={ev.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px 12px', fontSize: 'var(--text-base)' }}>{dayjs(ev.evaluationDate).format('DD/MM/YYYY')}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 500, backgroundColor: sc.bg, color: sc.color }}>
                      {t(`status.${ev.status}`)}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <button onClick={() => navigate(`/evaluaciones/${ev.id}`)} style={{
                      padding: '3px 8px', backgroundColor: 'transparent', color: 'var(--color-primary)',
                      border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', fontSize: 'var(--text-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                      <Eye size={11} /> {t('evaluations.open')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const backBtnStyle = {
  width: '36px', height: '36px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer', color: 'var(--color-text)'
};

const accentBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
  padding: 'var(--space-sm) var(--space-md)',
  backgroundColor: 'var(--color-accent)',
  color: 'var(--color-text-on-primary)',
  border: 'none', borderRadius: 'var(--radius-sm)',
  cursor: 'pointer', fontSize: 'var(--text-base)', fontWeight: 500
};

const dangerBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
  padding: 'var(--space-sm) var(--space-md)',
  backgroundColor: 'transparent',
  color: 'var(--color-error)',
  border: '1px solid var(--color-error)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer', fontSize: 'var(--text-base)'
};
