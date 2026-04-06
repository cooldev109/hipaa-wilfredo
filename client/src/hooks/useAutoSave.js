import { useEffect, useRef, useState, useCallback } from 'react';

export function useAutoSave(saveFn, intervalMs = 30000) {
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const dirtyRef = useRef(false);
  const dataRef = useRef(null);
  const timerRef = useRef(null);

  const markDirty = useCallback((data) => {
    dirtyRef.current = true;
    dataRef.current = data;
    setIsDirty(true);
  }, []);

  const doSave = useCallback(async () => {
    if (!dirtyRef.current || !dataRef.current) return;

    setSaving(true);
    try {
      await saveFn(dataRef.current);
      dirtyRef.current = false;
      setIsDirty(false);
      setLastSaved(new Date());
    } catch {
      // Silent fail — auto-save should not interrupt the user
    } finally {
      setSaving(false);
    }
  }, [saveFn]);

  // Interval timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (dirtyRef.current) {
        doSave();
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [doSave, intervalMs]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return { markDirty, isDirty, saving, lastSaved, forceSave: doSave };
}
