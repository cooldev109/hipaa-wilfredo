import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { createPatientApi } from '../../services/patientService';
import { ArrowLeft, Save } from 'lucide-react';

const THERAPY_KEYS = [
  'occupational', 'occupationalSensory', 'speech', 'physical', 'educational', 'psychological', 'functionalVision'
];

export default function PatientCreatePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', sex: '',
    school: '', grade: '', referredBy: '',
    parentGuardianName: '', parentGuardianPhone: '', parentGuardianEmail: ''
  });

  const [history, setHistory] = useState({
    visualHistory: '', medicalHistory: '', medications: '',
    familyOcularHistory: '', familyMedicalHistory: '',
    developmentalBirthWeeks: '', developmentalBirthType: '',
    developmentalCrawledMonths: '', developmentalWalkedMonths: '', developmentalTalkedMonths: '',
    therapies: {}
  });

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateHistory = (field, value) => setHistory((prev) => ({ ...prev, [field]: value }));
  const toggleTherapy = (key) => setHistory((prev) => ({
    ...prev,
    therapies: { ...prev.therapies, [key]: !prev.therapies[key] }
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await createPatientApi({ ...form, history });
      if (data.success) {
        navigate(`/pacientes/${data.data.id}`);
      }
    } catch (err) {
      const code = err.response?.data?.errorCode;
      setError(t(`error.${code}`) || t('error.server'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        <button onClick={() => navigate('/pacientes')} style={backBtnStyle}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1>{t('patients.new')}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{t('patients.newDesc')}</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)', fontSize: 'var(--text-sm)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Data */}
        <Section title={t('patients.personalData')}>
          <div style={gridTwo}>
            <Field label={t('patients.firstName')} required>
              <input value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} required />
            </Field>
            <Field label={t('patients.lastName')} required>
              <input value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} required />
            </Field>
            <Field label={t('patients.dateOfBirth')} required>
              <input type="date" value={form.dateOfBirth} onChange={(e) => updateForm('dateOfBirth', e.target.value)} required />
            </Field>
            <Field label={t('patients.sex')} required>
              <select value={form.sex} onChange={(e) => updateForm('sex', e.target.value)} required>
                <option value="">{t('common.select')}</option>
                <option value="M">{t('patients.male')}</option>
                <option value="F">{t('patients.female')}</option>
              </select>
            </Field>
            <Field label={t('patients.school')}>
              <input value={form.school} onChange={(e) => updateForm('school', e.target.value)} />
            </Field>
            <Field label={t('patients.grade')}>
              <input value={form.grade} onChange={(e) => updateForm('grade', e.target.value)} />
            </Field>
            <Field label={t('patients.referredBy')} span2>
              <input value={form.referredBy} onChange={(e) => updateForm('referredBy', e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Parent/Guardian */}
        <Section title={t('patients.guardian')}>
          <div style={gridTwo}>
            <Field label={t('patients.guardianName')}>
              <input value={form.parentGuardianName} onChange={(e) => updateForm('parentGuardianName', e.target.value)} />
            </Field>
            <Field label={t('patients.guardianPhone')}>
              <input type="tel" value={form.parentGuardianPhone} onChange={(e) => updateForm('parentGuardianPhone', e.target.value)} />
            </Field>
            <Field label={t('patients.guardianEmail')} span2>
              <input type="email" value={form.parentGuardianEmail} onChange={(e) => updateForm('parentGuardianEmail', e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Medical History */}
        <Section title={t('patients.medicalHistory')}>
          <div style={gridTwo}>
            <Field label={t('patients.visualHistory')}>
              <textarea rows={3} value={history.visualHistory} onChange={(e) => updateHistory('visualHistory', e.target.value)} />
            </Field>
            <Field label={t('patients.medHistory')}>
              <textarea rows={3} value={history.medicalHistory} onChange={(e) => updateHistory('medicalHistory', e.target.value)} />
            </Field>
            <Field label={t('patients.medications')} span2>
              <textarea rows={2} value={history.medications} onChange={(e) => updateHistory('medications', e.target.value)} />
            </Field>
            <Field label={t('patients.familyOcularHistory')}>
              <textarea rows={2} value={history.familyOcularHistory} onChange={(e) => updateHistory('familyOcularHistory', e.target.value)} />
            </Field>
            <Field label={t('patients.familyMedHistory')}>
              <textarea rows={2} value={history.familyMedicalHistory} onChange={(e) => updateHistory('familyMedicalHistory', e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Developmental */}
        <Section title={t('patients.developmental')}>
          <div style={gridFour}>
            <Field label={t('patients.birthWeeks')}>
              <input type="number" value={history.developmentalBirthWeeks} onChange={(e) => updateHistory('developmentalBirthWeeks', e.target.value)} />
            </Field>
            <Field label={t('patients.birthType')}>
              <select value={history.developmentalBirthType} onChange={(e) => updateHistory('developmentalBirthType', e.target.value)}>
                <option value="">{t('common.select')}</option>
                <option value="natural">{t('patients.natural')}</option>
                <option value="cesarean">{t('patients.cesarean')}</option>
              </select>
            </Field>
            <Field label={t('patients.crawledMonths')}>
              <input type="number" value={history.developmentalCrawledMonths} onChange={(e) => updateHistory('developmentalCrawledMonths', e.target.value)} />
            </Field>
            <Field label={t('patients.walkedMonths')}>
              <input type="number" value={history.developmentalWalkedMonths} onChange={(e) => updateHistory('developmentalWalkedMonths', e.target.value)} />
            </Field>
            <Field label={t('patients.talkedMonths')}>
              <input type="number" value={history.developmentalTalkedMonths} onChange={(e) => updateHistory('developmentalTalkedMonths', e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Therapies */}
        <Section title={t('patients.therapies')}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            {THERAPY_KEYS.map((key) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer', fontSize: 'var(--text-base)' }}>
                <input
                  type="checkbox"
                  checked={!!history.therapies[key]}
                  onChange={() => toggleTherapy(key)}
                  style={{ width: 'auto', accentColor: 'var(--color-primary)' }}
                />
                {t(`patients.therapy.${key}`)}
              </label>
            ))}
          </div>
        </Section>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
          <button type="submit" disabled={loading} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
            padding: 'var(--space-sm) var(--space-xl)',
            backgroundColor: loading ? 'var(--color-secondary)' : 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
            border: 'none', borderRadius: 'var(--radius-sm)',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 'var(--text-base)', fontWeight: 500
          }}>
            <Save size={16} />
            {loading ? t('common.loading') : t('common.save')}
          </button>
          <button type="button" onClick={() => navigate('/pacientes')} style={{
            padding: 'var(--space-sm) var(--space-xl)',
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-base)'
          }}>
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      padding: 'var(--space-lg)',
      marginBottom: 'var(--space-lg)',
      transition: 'var(--transition-theme)'
    }}>
      <h3 style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, required, span2, children }) {
  return (
    <div style={span2 ? { gridColumn: 'span 2' } : {}}>
      <label>
        {label}
        {required && <span style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
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

const gridTwo = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 'var(--space-md)'
};

const gridFour = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 'var(--space-md)'
};
