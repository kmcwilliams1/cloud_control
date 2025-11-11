// typescript
  // file: `src/components/APIChart.tsx`
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

      const snippetMap: Record<string, string> = {
        aws: `import json\n\ndef lambda_handler(event, context):\n    # TODO implement\n    return {\n        'statusCode': 200,\n        'body': json.dumps('Hello from Lambda!')\n    }`,
        gcp: `import json\n\ndef gcp_handler(request):\n    # TODO implement\n    return {\n        'statusCode': 200,\n        'body': json.dumps('Hello from Cloud Function!')\n    }`,
        azure: `import json\n\ndef main(req: dict) -> dict:\n    # TODO implement\n    return {\n        'statusCode': 200,\n        'body': json.dumps('Hello from Azure Function!')\n    }`,
      };

      setSelectedResource(null);
      setCode(snippetMap[provider] || '');

      const key = provider.toLowerCase().trim();
      const urlPath = fileMap[key] || null;
      if (!urlPath) {
        setCategories(null);
        setError(`No resources file mapped for provider: ${provider}`);
        return;
      }

      const base = process.env.PUBLIC_URL || '';
      const resolvedUrl = urlPath.startsWith('/') ? `${base}${urlPath}` : `${base}/${urlPath}`;

      setLoading(true);
      setError(null);
      setCategories(null);

      fetch(resolvedUrl, { cache: 'no-store' })
        .then(async (r) => {
          const text = await r.text();
          const ct = (r.headers.get('content-type') || '').toLowerCase();

          if (!r.ok) {
            throw new Error(`Request failed (${r.status}) when loading ${resolvedUrl}. Response snippet: ${text.slice(0, 200)}`);
          }

          // Detect HTML/index.html being returned instead of JSON
          if (ct.includes('html') || text.trim().startsWith('<')) {
            throw new Error(`Invalid JSON from ${resolvedUrl}: response appears to be HTML. Response snippet: ${text.slice(0, 200)}`);
          }

          try {
            return JSON.parse(text) as { categories?: Category[] };
          } catch (e) {
            throw new Error(`Invalid JSON from ${resolvedUrl}: ${(e as Error).message}. Response snippet: ${text.slice(0, 200)}`);
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
      setSelectedResource(service);
      setCode((prev) => {
        if (!prev) return `# ${service}\n\n`;
        if (prev.includes(`# Resource:`)) return prev;
        return `# Resource: ${service}\n` + prev;
      });
    };

    return (
      <div style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          {providers.map((p) => (
            <button
              key={p.key}
              onClick={() => setProvider(p.key)}
              style={{
                padding: '10px 14px',
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, minHeight: 360 }}>
          <div style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px dashed #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 800 }}>{provider ? `${provider.toUpperCase()} Resources` : 'Resources'}</div>
              <div>
                <button
                  onClick={() => {
                    setProvider(null);
                    setCategories(null);
                  }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  Clear
                </button>
              </div>
            </div>

            {provider === null && <div style={{ color: '#777' }}>Select AWS, GCP or Azure to load resources.</div>}

            {provider && (
              <>
                {loading && <div style={{ padding: 8 }}>Loading…</div>}
                {error && <div style={{ color: 'crimson', padding: 8 }}>{error}</div>}

                {!loading && !error && categories && categories.length > 0 && (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {categories.map((cat) => (
                      <div key={cat.name} style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ fontWeight: 800, marginBottom: 6 }}>{cat.name}</div>
                        <ul style={{ marginTop: 6, marginBottom: 0, paddingLeft: 18 }}>
                          {cat.services.map((s) => (
                            <li key={s} style={{ marginBottom: 6 }}>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onServiceClick(s);
                                }}
                                style={{ color: '#0067b8', textDecoration: 'none', cursor: 'pointer' }}
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

                {!loading && !error && (!categories || categories.length === 0) && (
                  <div style={{ color: '#666' }}>No resources found.</div>
                )}
              </>
            )}
          </div>

          <div style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #e6eef8', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <button style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Deploy (⇧⌘U)</button>
              <button style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Test (⇧⌘I)</button>
            </div>

            {selectedResource ? (
              <div style={{ display: 'flex', gap: 12, height: '100%' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>{selectedResource}</div>
                  <pre style={{ whiteSpace: 'pre-wrap', background: '#f7f9fc', padding: 12, borderRadius: 6, height: '100%', overflow: 'auto' }}>{code}</pre>
                </div>
                <div style={{ width: 220, borderLeft: '1px solid #eee', paddingLeft: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Actions</div>
                  <button style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }}>Run</button>
                  <button style={{ display: 'block', width: '100%', padding: 8 }}>Share</button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                Choose a resource to edit or deploy.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }