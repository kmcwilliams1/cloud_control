// File: src/components/ResourcesPopup.tsx
import React, { useEffect, useState } from 'react';

type Category = {
  name: string;
  services: string[];
};

type Props = {
  visible: boolean;
  provider?: string;
  onClose: () => void;
};

export default function ResourcesPopup({ visible, provider, onClose }: Props) {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    if ((provider || '').toLowerCase() !== 'aws') {
      setCategories(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch('/awsServices.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load services');
        return r.json();
      })
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error');
        setLoading(false);
      });
  }, [visible, provider]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0,0,0,0.35)',
        zIndex: 1200,
        padding: 24,
      }}
    >
      <div
        style={{
          width: 'min(1100px, 96%)',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 10,
          border: '1px solid #e6e6e6',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Services by category</h2>
          <button
            onClick={onClose}
            aria-label="Close resources"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              padding: 6,
            }}
          >
            ✕
          </button>
        </div>

        {loading && <div style={{ padding: 12 }}>Loading…</div>}
        {error && <div style={{ color: 'crimson', padding: 12 }}>{error}</div>}

        {!loading && !error && categories && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              alignItems: 'start',
            }}
          >
            {categories.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: '#f3f4f6',
                      display: 'inline-grid',
                      placeItems: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {/* small icon placeholder */}
                    {cat.name[0]}
                  </div>
                  <div style={{ fontWeight: 800 }}>{cat.name}</div>
                </div>

                <ul style={{ marginTop: 6, marginBottom: 0, paddingLeft: 18 }}>
                  {cat.services.map((s) => (
                    <li key={s} style={{ marginBottom: 6 }}>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        style={{ color: '#0067b8', textDecoration: 'none' }}
                      >
                        {s}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}