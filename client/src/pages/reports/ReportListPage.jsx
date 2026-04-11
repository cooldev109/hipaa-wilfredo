import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { listReportsApi, generateReportApi } from '../../services/reportService';
import EvaluationPicker from '../../components/forms/EvaluationPicker';
import { Plus, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

export default function ReportListPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const [evalId, setEvalId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const loadReports = async (page = 1) => {
    setLoading(true);
    try {
      const data = await listReportsApi({ page, limit: 25 });
      if (data.success) {
        setReports(data.data.reports);
        setPagination(data.data.pagination);
      }
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReports(); }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!evalId.trim()) return;
    setGenerating(true);
    setError('');
    try {
      const data = await generateReportApi(evalId.trim());
      if (data.success) {
        navigate(`/informes/${data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.errorCode || t('error.server'));
    } finally {
      setGenerating(false);
    }
  };

  const statusColors = {
    draft: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: 'var(--color-warning)' },
    final: { bg: 'var(--color-info-bg)', color: 'var(--color-info)', border: 'var(--color-info)' },
    signed: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: 'var(--color-success)' }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1>{t('reports.title')}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
            {pagination.total} {t('reports.total')}
          </p>
        </div>
        <button onClick={() => setShowGenerate(!showGenerate)} style={primaryBtnStyle}>
          <Plus size={16} /> {t('reports.generate')}
        </button>
      </div>

      {showGenerate && (
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>{t('reports.generate')}</h3>
          {error && <div style={{ padding: 'var(--space-sm)', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)', fontSize: 'var(--text-sm)' }}>{error}</div>}
          <form onSubmit={handleGenerate} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label>{t('reports.evaluationId')}</label>
              <EvaluationPicker value={evalId} onChange={(id) => setEvalId(id)} placeholder="Select a completed evaluation..." />
            </div>
            <button type="submit" disabled={generating} style={primaryBtnStyle}>
              {generating ? t('common.loading') : t('reports.generate')}
            </button>
            <button type="button" onClick={() => setShowGenerate(false)} style={secondaryBtnStyle}>
              {t('common.cancel')}
            </button>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-primary)' }}>
              <th style={thStyle}>{t('reports.patient')}</th>
              <th style={thStyle}>{t('reports.version')}</th>
              <th style={thStyle}>{t('reports.status')}</th>
              <th style={thStyle}>{t('reports.created')}</th>
              <th style={thStyle}>{t('reports.doctorSigned')}</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>{t('reports.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ ...tdStyle, textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>{t('common.loading')}</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan="6" style={{ ...tdStyle, textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>{t('reports.noResults')}</td></tr>
            ) : reports.map((r, i) => {
              const sc = statusColors[r.status] || statusColors.draft;
              return (
                <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-alt)', cursor: 'pointer' }} onClick={() => navigate(`/informes/${r.id}`)}>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{r.patientLastName || '—'}, {r.patientFirstName || '—'}</td>
                  <td style={tdStyle}>v{r.version}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 500, backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {t(`status.${r.status}`)}
                    </span>
                  </td>
                  <td style={tdStyle}>{dayjs(r.createdAt).format('DD/MM/YYYY')}</td>
                  <td style={tdStyle}>{r.doctorSignedAt ? dayjs(r.doctorSignedAt).format('DD/MM HH:mm') : '—'}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/informes/${r.id}`); }} style={actionBtnStyle}>
                        <Eye size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          <span>{t('common.showing')} {((pagination.page - 1) * 25) + 1}–{Math.min(pagination.page * 25, pagination.total)} {t('common.of')} {pagination.total}</span>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button disabled={pagination.page <= 1} onClick={() => loadReports(pagination.page - 1)} style={pagBtnStyle}><ChevronLeft size={14} /></button>
            <span style={{ padding: '4px 8px' }}>{pagination.page} / {pagination.totalPages}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadReports(pagination.page + 1)} style={pagBtnStyle}><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: '10px 16px', textAlign: 'left', color: '#FFFFFF', fontSize: 'var(--text-sm)', fontWeight: 600 };
const tdStyle = { padding: '10px 16px', fontSize: 'var(--text-base)', borderBottom: '1px solid var(--color-border)' };
const primaryBtnStyle = { display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-base)', fontWeight: 500 };
const secondaryBtnStyle = { padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-base)' };
const actionBtnStyle = { padding: '4px 8px', backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const pagBtnStyle = { padding: '4px 8px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center' };
