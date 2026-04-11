export default function Skeleton({ width = '100%', height = 16, borderRadius = 'var(--radius-sm)', style = {} }) {
  return (
    <div
      className="skeleton-pulse"
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-surface-alt)',
        ...style
      }}
    />
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface-alt)' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} width={`${100 / cols}%`} height={14} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} width={`${100 / cols}%`} height={12} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      padding: 'var(--space-lg)'
    }}>
      <Skeleton width="40%" height={18} style={{ marginBottom: 16 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${70 + Math.random() * 30}%`} height={12} style={{ marginBottom: 10 }} />
      ))}
    </div>
  );
}
