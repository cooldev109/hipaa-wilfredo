import { useState, useEffect, useRef } from 'react';
import { listEvaluationsApi } from '../../services/evaluationService';
import { Search, X, ClipboardList } from 'lucide-react';
import dayjs from 'dayjs';

export default function EvaluationPicker({ value, onChange, placeholder = 'Search evaluations...' }) {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (open && evaluations.length === 0) {
      setLoading(true);
      listEvaluationsApi({ status: 'complete', limit: 50 }).then((data) => {
        if (data.success) setEvaluations(data.data.evaluations);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [open]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (ev) => {
    setSelected(ev);
    onChange(ev.id);
    setOpen(false);
  };

  const handleClear = () => {
    setSelected(null);
    onChange('');
  };

  const statusColors = {
    draft: 'var(--color-warning)',
    complete: 'var(--color-info)',
    signed: 'var(--color-success)'
  };

  if (selected) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', border: '1px solid var(--color-primary)',
        borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-alt)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClipboardList size={16} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 500 }}>{selected.patientLastName}, {selected.patientFirstName}</span>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            — {dayjs(selected.evaluationDate).format('MM/DD/YYYY')}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: statusColors[selected.status], fontWeight: 500 }}>
            [{selected.status}]
          </span>
        </div>
        <button onClick={handleClear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input
          readOnly
          value=""
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          placeholder={placeholder}
          style={{ paddingLeft: 36, width: '100%', cursor: 'pointer' }}
        />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
          maxHeight: 300, overflowY: 'auto', marginTop: 4
        }}>
          {loading ? (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Loading evaluations...
            </div>
          ) : evaluations.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              No completed evaluations found
            </div>
          ) : (
            evaluations.map((ev) => (
              <div
                key={ev.id}
                onClick={() => handleSelect(ev)}
                style={{
                  padding: '10px 14px', cursor: 'pointer',
                  borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.1s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ fontWeight: 500, fontSize: 'var(--text-base)' }}>
                  {ev.patientLastName}, {ev.patientFirstName}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {dayjs(ev.evaluationDate).format('MM/DD/YYYY')} · Status: <span style={{ color: statusColors[ev.status], fontWeight: 500 }}>{ev.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
