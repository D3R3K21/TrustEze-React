import React from 'react';

type PanelProps = {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  // Accepts values like '12rem', '60%', '30vh', or a number (px)
  minHeight?: string | number;
  width?: string | number;
  maxWidth?: string | number;
};

export default function Panel({ title, subtitle, minHeight, width, maxWidth }: PanelProps) {
  return (
    <div
      style={{
        backgroundColor: '#2b2b2b',
        color: '#ffffff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 6px 12px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Defaults to 10rem (~160px). You can override with 'vh', '%', or 'rem'.
        minHeight: minHeight ?? '10rem',
        width: width ?? '100%',
        maxWidth: maxWidth ?? '100%',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          // Fluid type from small screens to large
          fontSize: 'clamp(1.75rem, 4.5vw, 2.5rem)',
          fontWeight: 700,
          letterSpacing: 0.5,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 'clamp(0.95rem, 1.4vw, 1.125rem)',
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}


