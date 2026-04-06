import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { getReportApi, downloadReportApi, signDoctorApi, signParentApi } from '../../services/reportService';
import SignatureCanvas from '../../components/forms/SignatureCanvas';
import { ArrowLeft, Download, PenTool, FileCheck, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

export default function ReportPreviewPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showDoctorSign, setShowDoctorSign] = useState(false);
  const [showParentSign, setShowParentSign] = useState(false);
  const [parentName, setParentName] = useState('');

  useEffect(() => { loadReport(); }, [id]);

  const loadReport = async () => {
    try {
      const data = await getReportApi(id);
      if (data.success) setReport(data.data);
    } catch {
      navigate('/informes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadReportApi(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert(t('error.server'));
    } finally {
      setDownloading(false);
    }
  };

  const handleDoctorSign = async (signatureData) => {
    try {
      await signDoctorApi(id, signatureData);
      setShowDoctorSign(false);
      loadReport();
    } catch {
      alert(t('error.server'));
    }
  };

  const handleParentSign = async (signatureData) => {
    if (!parentName.trim()) {
      alert(t('report.parentNameRequired'));
      return;
    }
    try {
      await signParentApi(id, signatureData, parentName);
      setShowParentSign(false);
      setParentName('');
      loadReport();
    } catch {
      alert(t('error.server'));
    }
  };

  if (loading) {
    return <div style={{ padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>{t('common.loading')}</div>;
  }

  if (!report) return null;

  const statusColors = {
    draft: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: 'var(--color-warning)' },
    final: { bg: 'var(--color-info-bg)', color: 'var(--color-info)', border: 'var(--color-info)' },
    signed: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success)' }
  };
  const sc = statusColors[report.status] || statusColors.draft;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button onClick={() => navigate('/informes')} style={backBtnStyle}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1>{t('report.title')}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              {t('report.version')} {report.version} — {dayjs(report.createdAt).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 500,
            backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
          }}>
            {t(`status.${report.status}`)}
          </span>
        </div>
      </div>

      {/* Report Info Card */}
      <div style={{
        backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-lg)' }}>
          <InfoItem label={t('report.evaluationId')} value={report.evaluationId?.substring(0, 8) + '...'} />
          <InfoItem label={t('report.version')} value={`v${report.version}`} />
          <InfoItem label={t('report.status')} value={t(`status.${report.status}`)} />
          <InfoItem label={t('report.doctorSigned')} value={report.doctorSignedAt ? dayjs(report.doctorSignedAt).format('DD/MM/YYYY HH:mm') : '—'} />
          <InfoItem label={t('report.parentSigned')} value={report.parentSignedAt ? `${report.parentSignerName} — ${dayjs(report.parentSignedAt).format('DD/MM/YYYY HH:mm')}` : '—'} />
          <InfoItem label={t('report.pdfHash')} value={report.pdfFileHash ? report.pdfFileHash.substring(0, 16) + '...' : '—'} />
        </div>
      </div>

      {/* Actions */}
      <div style={{
        backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)'
      }}>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('report.actions')}</h3>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {/* Download */}
          <button onClick={handleDownload} disabled={downloading} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
            padding: 'var(--space-sm) var(--space-lg)',
            backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)',
            border: 'none', borderRadius: 'var(--radius-sm)',
            cursor: downloading ? 'not-allowed' : 'pointer', fontSize: 'var(--text-base)', fontWeight: 500
          }}>
            {downloading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={16} />}
            {t('report.download')}
          </button>

          {/* Doctor Sign */}
          {!report.doctorSignedAt && (
            <button onClick={() => setShowDoctorSign(true)} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-lg)',
              backgroundColor: 'var(--color-accent)', color: 'var(--color-text-on-primary)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: 'var(--text-base)', fontWeight: 500
            }}>
              <PenTool size={16} /> {t('report.signDoctor')}
            </button>
          )}

          {/* Parent Sign */}
          {report.doctorSignedAt && !report.parentSignedAt && (
            <button onClick={() => setShowParentSign(true)} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-lg)',
              backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-on-primary)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: 'var(--text-base)', fontWeight: 500
            }}>
              <PenTool size={16} /> {t('report.signParent')}
            </button>
          )}

          {/* Fully signed indicator */}
          {report.status === 'signed' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-lg)',
              backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)',
              borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontWeight: 500,
              border: '1px solid var(--color-success)'
            }}>
              <FileCheck size={16} /> {t('report.fullySigned')}
            </div>
          )}
        </div>
      </div>

      {/* Condition Blocks Preview */}
      {report.conditionBlocks && (
        <div style={{
          backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)', padding: 'var(--space-lg)'
        }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('report.includedBlocks')}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            {(typeof report.conditionBlocks === 'string' ? JSON.parse(report.conditionBlocks) : report.conditionBlocks)
              .filter((b) => b.included)
              .map((b) => (
                <span key={b.key} style={{
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)', fontWeight: 500,
                  backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text)',
                  border: '1px solid var(--color-border)'
                }}>
                  {b.key}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Signature Modals */}
      {showDoctorSign && (
        <SignatureCanvas
          title={t('report.doctorSignatureTitle')}
          onSave={handleDoctorSign}
          onCancel={() => setShowDoctorSign(false)}
        />
      )}

      {showParentSign && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)', width: '500px', maxWidth: '95vw'
          }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('report.parentNameLabel')}</h3>
            <input
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder={t('report.parentNamePlaceholder')}
              style={{ marginBottom: 'var(--space-md)' }}
            />
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowParentSign(false); setParentName(''); }} style={{
                padding: 'var(--space-sm) var(--space-lg)', backgroundColor: 'transparent',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer'
              }}>
                {t('common.cancel')}
              </button>
              <button
                onClick={() => { if (parentName.trim()) { setShowParentSign(false); setShowParentSign('canvas'); } }}
                disabled={!parentName.trim()}
                style={{
                  padding: 'var(--space-sm) var(--space-lg)',
                  backgroundColor: parentName.trim() ? 'var(--color-primary)' : 'var(--color-border)',
                  color: 'var(--color-text-on-primary)', border: 'none',
                  borderRadius: 'var(--radius-sm)', cursor: parentName.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                {t('common.next')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showParentSign === 'canvas' && (
        <SignatureCanvas
          title={`${t('report.parentSignatureTitle')} — ${parentName}`}
          onSave={handleParentSign}
          onCancel={() => { setShowParentSign(false); setParentName(''); }}
        />
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{label}</p>
      <p style={{ fontSize: 'var(--text-base)', fontWeight: 500 }}>{value}</p>
    </div>
  );
}

const backBtnStyle = {
  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-text)'
};
