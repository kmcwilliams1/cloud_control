// File: `src/components/APIChart.tsx`
import React, { JSX, useEffect, useState } from 'react';

type Category = { name: string; services: string[] };

const providerColors: Record<string, string> = {
  AWS: '#F6E08A',
  GCP: '#CFE9FF',
  AZURE: '#C7E9C9',
};

const fileMap: Record<string, string> = {
  aws: '/awsServices.json',
  amazon: '/awsServices.json',
  gcp: '/gcpResources.json',
  google: '/gcpResources.json',
  azure: '/azureResources.json',
  microsoft: '/azureResources.json',
};

export default function APIChart(): JSX.Element {
  const [provider, setProvider] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  useEffect(() => {
    if (!provider) {
      setCategories(null);
      setLoading(false);
      setError(null);
      setCode('');
      setSelectedResource(null);
      return;
    }

    // prefill the editor with a small snippet per provider (kept here but editor is hidden until a resource is chosen)
    const snippetMap: Record<string, string> = {
      aws: `import json\n\ndef lambda_handler(event, context):\n    # TODO implement\n    return {\n        'statusCode': 200,\n        'body': json.dumps('Hello from Lambda!')\n    }`,
      gcp: `import json\n\ndef gcp_handler(request):\n    # TODO implement\n    return {\n        'statusCode': 200,\n        'body': json.dumps('Hello from Cloud Function!')\n    }`,
      azure: `import json\n\ndef main(req: dict) -> dict:\n    # TODO implement\n    return {\n        'statusCode': 200,\n        'body': json.dumps('Hello from Azure Function!')\n    }`,
    };

    // clear any previously selected resource when provider changes
    setSelectedResource(null);
    setCode(snippetMap[provider] || '');

    const key = provider.toLowerCase().trim();
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
        if (!r.ok) throw new Error(`Request failed (${r.status}). Response snippet: ${text.slice(0, 200)}`);
        try {
          return JSON.parse(text) as { categories?: Category[] };
        } catch (e) {
          throw new Error(`Invalid JSON from ${url}: ${(e as Error).message}`);
        }
      })
      .then((data) => {
        setCategories((data && data.categories) || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load resources');
        setLoading(false);
      });
  }, [provider]);

  const providers: { key: string; label: string }[] = [
    { key: 'aws', label: 'AWS' },
    { key: 'gcp', label: 'GCP' },
    { key: 'azure', label: 'AZURE' },
  ];

  const onServiceClick = (service: string) => {
    // choose the resource and ensure editor is visible
    setSelectedResource(service);
    // optionally prefill code with resource context
    setCode((prev) => {
      if (!prev) return `# ${service}\n\n` ;
      // add a short header if not already present
      if (prev.includes(`# Resource:`)) return prev;
      return `# Resource: ${service}\n` + prev;
    });
  };

  return (
    <div style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Top buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        {providers.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              // toggling provider clears selected resource
              setProvider((prev) => (prev === p.key ? null : p.key));
              setSelectedResource(null);
            }}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              textTransform: 'uppercase',
              background: provider === p.key ? (providerColors[p.label as keyof typeof providerColors] || '#ddd') : '#fff',
              boxShadow: provider === p.key ? 'inset 0 -2px rgba(0,0,0,0.06)' : '0 1px 0 rgba(0,0,0,0.04)',
              color: '#111',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Two-column panel: left = resources, right = editor (editor only shows code when a resource is selected) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minHeight: 360 }}>
        <div style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px dashed #e0e0e0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 800 }}>{provider ? `${provider.toUpperCase()} Resources` : 'Resources'}</div>
            <div>
              <button
                onClick={() => { setProvider(null); setSelectedResource(null); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}
                aria-label="Close resources"
              >
                ✕
              </button>
            </div>
          </div>

          {provider === null && <div style={{ color: '#777' }}>Select AWS, GCP or Azure to load resources.</div>}

          {provider && (
            <>
              {loading && <div style={{ padding: 8 }}>Loading…</div>}
              {error && <div style={{ color: 'crimson', padding: 8 }}>{error}</div>}

              {!loading && !error && categories && categories.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {categories.map((cat) => (
                    <div key={cat.name} style={{ padding: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f3f4f6', display: 'inline-grid', placeItems: 'center', fontWeight: 700 }}>
                          {cat.name[0]}
                        </div>
                        <div style={{ fontWeight: 800 }}>{cat.name}</div>
                      </div>

                      <ul style={{ marginTop: 6, marginBottom: 0, paddingLeft: 18 }}>
                        {cat.services.map((s) => {
                          const isSelected = selectedResource === s;
                          return (
                            <li key={s} style={{ marginBottom: 6 }}>
                              <button
                                onClick={() => onServiceClick(s)}
                                style={{
                                  background: isSelected ? '#eef6ff' : 'transparent',
                                  border: 'none',
                                  color: isSelected ? '#0b66d1' : '#0067b8',
                                  cursor: 'pointer',
                                  padding: '4px 6px',
                                  borderRadius: 6,
                                  textDecoration: 'none',
                                  fontWeight: isSelected ? 800 : 600,
                                }}
                                aria-pressed={isSelected}
                              >
                                {s}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && (!categories || categories.length === 0) && (
                <div style={{ color: '#666' }}>No resources found.</div>
              )}
            </>
          )}
        </div>

        {/* Right: Editor + Deploy/Test UI - code editor area only visible when a resource is selected */}
        <div style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #e6eef8', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button
              style={{
                flex: 1,
                background: '#1e6fd8',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: 6,
                border: 'none',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 0 rgba(0,0,0,0.12)',
              }}
            >
              Deploy (⇧⌘U)
            </button>
            <button
              style={{
                flex: 1,
                background: '#1e6fd8',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: 6,
                border: 'none',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 0 rgba(0,0,0,0.12)',
              }}
            >
              Test (⇧⌘I)
            </button>
          </div>

          {selectedResource ? (
            <div style={{ display: 'flex', gap: 12, height: '100%' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>{provider ? `${provider.toUpperCase()} - ${selectedResource}` : selectedResource}</div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Write function code here..."
                  style={{
                    flex: 1,
                    width: '100%',
                    minHeight: 220,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace',
                    fontSize: 13,
                    lineHeight: '1.45',
                    padding: 12,
                    borderRadius: 6,
                    border: '1px solid #e6eef8',
                    resize: 'vertical',
                    background: '#fff',
                    color: '#111',
                  }}
                />
              </div>

              <div style={{ width: 200, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>Test Events</div>
                <div style={{ flex: 1, background: '#fafafa', border: '1px solid #eee', borderRadius: 6, padding: 10, overflowY: 'auto' }}>
                  <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>Events</div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer' }}>
                    + Create new test event
                  </button>
                  {/* placeholder list */}
                  <div style={{ marginTop: 12, color: '#777', fontSize: 13 }}>
                    No test events yet.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              Select a resource on the left to open the editor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}