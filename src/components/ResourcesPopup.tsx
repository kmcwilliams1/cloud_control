// File: `src/components/ResourcesPopup.tsx`
  import React, { useEffect, useState } from 'react';

  type Category = { name: string; services: string[] };
  type Props = { visible: boolean; provider?: string; onClose: () => void };

  export default function ResourcesPopup({ visible, provider, onClose }: Props) {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!visible) return;

      const key = (provider || '').toLowerCase().trim();
      if (!key) {
        setCategories(null);
        setError('No provider specified');
        return;
      }

      // explicit mapping to filenames (normalize common aliases)
      const fileMap: Record<string, string> = {
        aws: '/awsServices.json',
        amazon: '/awsServices.json',
        gcp: '/gcpResources.json',
        google: '/gcpResources.json',
        azure: '/azureResources.json',
        microsoft: '/azureResources.json',
      };

      const url = fileMap[key] || null;

      if (!url) {
        setCategories(null);
        setError(`No resources file mapped for provider: ${provider}`);
        return;
      }

      setLoading(true);
      setError(null);
      setCategories(null);

      fetch(url)
        .then(async (r) => {
          const text = await r.text();
          const ct = r.headers.get('content-type') || '';

          if (!r.ok) {
            throw new Error(`Request failed (${r.status}) when loading ${url}. Response snippet: ${text.slice(0, 200)}`);
          }

          try {
            // try parse JSON regardless of content-type but provide helpful error if fails
            return JSON.parse(text);
          } catch (e) {
            throw new Error(`Invalid JSON from ${url}: ${(e as Error).message}. Response snippet: ${text.slice(0, 200)}`);
          }
        })
        .then((data) => {
          setCategories((data && data.categories) || []);
          setLoading(false);
        })
        .catch((err) => {
          console.warn('ResourcesPopup load error:', err);
          setError(err.message || 'Failed to load resources');
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
            <h2 style={{ margin: 0, fontSize: 20 }}>{provider ? `${provider.toUpperCase()} Services` : 'Services by category'}</h2>
            <button onClick={onClose} aria-label="Close resources" style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', padding: 6 }}>✕</button>
          </div>

          {loading && <div style={{ padding: 12 }}>Loading…</div>}
          {error && <div style={{ color: 'crimson', padding: 12 }}>{error}</div>}

          {!loading && !error && categories && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f3f4f6', display: 'inline-grid', placeItems: 'center', fontWeight: 700 }}>
                      {cat.name[0]}
                    </div>
                    <div style={{ fontWeight: 800 }}>{cat.name}</div>
                  </div>

                  <ul style={{ marginTop: 6, marginBottom: 0, paddingLeft: 18 }}>
                    {cat.services.map((s) => (
                      <li key={s} style={{ marginBottom: 6 }}>
                        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#0067b8', textDecoration: 'none' }}>{s}</a>
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