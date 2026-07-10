import type { ReactNode } from 'react';

interface DeviceFrameProps {
  accentColor: string;
  path: string;
  children: ReactNode;
}

/** Browser-chrome frame that hosts each feature mockup, tinted by the active portal color. */
export function DeviceFrame({ accentColor, path, children }: DeviceFrameProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 560,
        borderRadius: 16,
        overflow: 'hidden',
        background: '#14141F',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `0 24px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02), 0 0 80px -20px ${accentColor}55`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '11px 14px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF5F57' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#FEBC2E' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor }} />
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
            app.manavidya.in{path}
          </span>
        </div>
      </div>
      <div style={{ padding: 20, background: '#0D0E17', minHeight: 320 }}>{children}</div>
    </div>
  );
}
