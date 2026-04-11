import { useState, useEffect, useRef } from 'react';
import { listPatientsApi } from '../../services/patientService';
import { Search, X, User } from 'lucide-react';

export default function PatientPicker({ value, onChange, placeholder = 'Search patient by name...' }) {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setPatients([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await listPatientsApi({ search: query, limit: 10 });
        if (data.success) setPatients(data.data.patients);
      } catch {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Load all patients initially when opened
  useEffect(() => {
    if (open && patients.length === 0 && !query) {
      setLoading(true);
      listPatientsApi({ limit: 20 }).then((data) => {
        if (data.success) setPatients(data.data.patients);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (patient) => {
    setSelected(patient);
    onChange(patient.id);
    setOpen(false);
    setQuery('');
  };

  const handleClear = () => {
    setSelected(null);
    onChange('');
    setQuery('');
  };

  if (selected) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', border: '1px solid var(--color-primary)',
        borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-alt)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <User size={16} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 500 }}>{selected.lastName}, {selected.firstName}</span>
          {selected.age && <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>({selected.age.years}y {selected.age.months}m)</span>}
          {selected.school && <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>— {selected.school}</span>}
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
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          style={{ paddingLeft: 36, width: '100%' }}
        />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
          maxHeight: 280, overflowY: 'auto', marginTop: 4
        }}>
          {loading ? (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Loading...
            </div>
          ) : patients.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              {query.length >= 2 ? 'No patients found' : 'Type to search...'}
            </div>
          ) : (
            patients.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                style={{
                  padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.1s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--text-xs)', fontWeight: 600, flexShrink: 0
                }}>
                  {p.firstName?.[0]}{p.lastName?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 'var(--text-base)' }}>
                    {p.lastName}, {p.firstName}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {p.age ? `${p.age.years}y ${p.age.months}m` : ''} {p.school ? `· ${p.school}` : ''} {p.grade ? `· ${p.grade}` : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
