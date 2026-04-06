import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAutoSave } from '../../hooks/useAutoSave';
import { getEvaluationApi, autoSaveEvaluationApi, updateEvaluationApi, changeEvaluationStatusApi } from '../../services/evaluationService';
import { ArrowLeft, Save, CheckCircle, Clock } from 'lucide-react';
import TabVisualAcuity from './tabs/TabVisualAcuity';
import TabOculomotor from './tabs/TabOculomotor';
import TabRefraction from './tabs/TabRefraction';
import TabBinocular from './tabs/TabBinocular';
import TabOcularHealth from './tabs/TabOcularHealth';
import TabPerceptual from './tabs/TabPerceptual';
import TabAssessment from './tabs/TabAssessment';
import dayjs from 'dayjs';

const TABS = [
  { key: 'visualAcuity', labelKey: 'eval.tab.visualAcuity' },
  { key: 'oculomotor', labelKey: 'eval.tab.oculomotor' },
  { key: 'refraction', labelKey: 'eval.tab.refraction' },
  { key: 'binocular', labelKey: 'eval.tab.binocular' },
  { key: 'ocularHealth', labelKey: 'eval.tab.ocularHealth' },
  { key: 'perceptual', labelKey: 'eval.tab.perceptual' },
  { key: 'assessment', labelKey: 'eval.tab.assessment' }
];

export default function EvaluationFormPage() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [evaluation, setEvaluation] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');

  const saveFn = useCallback(async (data) => {
    await autoSaveEvaluationApi(id, data);
  }, [id]);

  const { markDirty, isDirty, saving, lastSaved, forceSave } = useAutoSave(saveFn);

  useEffect(() => {
    loadEvaluation();
  }, [id]);

  const loadEvaluation = async () => {
    try {
      const data = await getEvaluationApi(id);
      if (data.success) {
        setEvaluation(data.data);
        setFormData(data.data);
      }
    } catch {
      navigate('/evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      markDirty(updated);
      return updated;
    });
  };

  const handleSaveDraft = async () => {
    try {
      await updateEvaluationApi(id, formData);
      setSaveMsg(t('eval.saved'));
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg(t('error.server'));
    }
  };

  const handleComplete = async () => {
    try {
      await forceSave();
      await updateEvaluationApi(id, formData);
      await changeEvaluationStatusApi(id, 'complete');
      navigate('/evaluaciones');
    } catch {
      setSaveMsg(t('error.server'));
    }
  };

  const handleTabChange = (index) => {
    if (isDirty) forceSave();
    setActiveTab(index);
  };

  if (loading) {
    return <div style={{ padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>{t('common.loading')}</div>;
  }

  if (!evaluation) return null;

  const tabComponents = [
    <TabVisualAcuity data={formData} onChange={updateField} t={t} />,
    <TabOculomotor data={formData} onChange={updateField} t={t} />,
    <TabRefraction data={formData} onChange={updateField} t={t} />,
    <TabBinocular data={formData} onChange={updateField} t={t} />,
    <TabOcularHealth data={formData} onChange={updateField} t={t} />,
    <TabPerceptual data={formData} onChange={updateField} t={t} />,
    <TabAssessment data={formData} onChange={updateField} t={t} language={language} />
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button onClick={() => navigate('/evaluaciones')} style={backBtnStyle}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1>{t('eval.title')}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              {evaluation.patientFirstName} {evaluation.patientLastName} — {dayjs(evaluation.evaluationDate).format('DD/MM/YYYY')}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          {/* Status badge */}
          <span style={{
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            backgroundColor: evaluation.status === 'draft' ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
            color: evaluation.status === 'draft' ? 'var(--color-warning)' : 'var(--color-success)',
            border: `1px solid ${evaluation.status === 'draft' ? 'var(--color-warning)' : 'var(--color-success)'}`
          }}>
            {t(`status.${evaluation.status}`)}
          </span>

          {/* Auto-save indicator */}
          {saving && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {t('eval.saving')}
            </span>
          )}
          {lastSaved && !saving && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={12} /> {t('eval.autoSaved')} {dayjs(lastSaved).format('HH:mm:ss')}
            </span>
          )}
        </div>
      </div>

      {/* Success/Error message */}
      {saveMsg && (
        <div style={{
          padding: 'var(--space-sm) var(--space-md)',
          backgroundColor: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-md)',
          fontSize: 'var(--text-sm)'
        }}>
          {saveMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '2px',
        marginBottom: 'var(--space-lg)',
        borderBottom: '2px solid var(--color-border)',
        overflowX: 'auto'
      }}>
        {TABS.map((tab, index) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(index)}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === index ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === index ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: activeTab === index ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginBottom: '-2px',
              transition: 'all 0.15s'
            }}
          >
            <span style={{ marginRight: '6px', fontSize: 'var(--text-xs)', opacity: 0.7 }}>{index + 1}</span>
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        padding: 'var(--space-lg)',
        minHeight: '400px',
        transition: 'var(--transition-theme)'
      }}>
        {tabComponents[activeTab]}
      </div>

      {/* Bottom Actions */}
      {evaluation.status !== 'signed' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {activeTab > 0 && (
              <button onClick={() => handleTabChange(activeTab - 1)} style={secondaryBtnStyle}>
                {t('common.previous')}
              </button>
            )}
            {activeTab < TABS.length - 1 && (
              <button onClick={() => handleTabChange(activeTab + 1)} style={primaryBtnStyle}>
                {t('common.next')}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button onClick={handleSaveDraft} style={secondaryBtnStyle}>
              <Save size={15} /> {t('eval.saveDraft')}
            </button>
            {activeTab === TABS.length - 1 && evaluation.status === 'draft' && (
              <button onClick={handleComplete} style={accentBtnStyle}>
                <CheckCircle size={15} /> {t('eval.markComplete')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const backBtnStyle = { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-text)' };
const primaryBtnStyle = { display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-sm) var(--space-lg)', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-base)', fontWeight: 500 };
const secondaryBtnStyle = { display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-sm) var(--space-lg)', backgroundColor: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-base)' };
const accentBtnStyle = { display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-sm) var(--space-lg)', backgroundColor: 'var(--color-accent)', color: 'var(--color-text-on-primary)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-base)', fontWeight: 500 };
