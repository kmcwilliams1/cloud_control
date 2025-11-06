import React from 'react';
import { useManifest } from '../hooks/useManifest';
import ManifestItem from '../components/ManifestItem';
import { useAuth } from '../contexts/AuthContext';

export default function UserHome() {
  const { user } = useAuth();
  const { items, loading } = useManifest(['/graphs/manifest.json', '/notGraphs/manifest.json']);

  const graphs = items.filter(i => i.folder === 'graphs');
  const shared = items.filter(i => i.folder === 'notGraphs');

  const userProviders: string[] = React.useMemo(() => {
    if (!user) return [];
    if (Array.isArray((user as any).providers)) return (user as any).providers.map((p: any) => String(p).toLowerCase());
    if ((user as any).provider) return [String((user as any).provider).toLowerCase()];
    return [];
  }, [user]);

  const providerGraphs = userProviders.length
    ? graphs.filter(g => (g.provider || '').toLowerCase() && userProviders.includes((g.provider || '').toLowerCase()))
    : graphs;

  if (loading) {
    return (
      <div className="page">
        <h1 className="summary-title">SUMMARY</h1>
        <div className="loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="summary-title">SUMMARY</h1>

      <div className="user-layout">
        <div className="left-col">
          {providerGraphs.length ? (
            providerGraphs.map(it => (
              <img key={it.file} className="img-box" src={`/${it.folder}/${it.file}`} alt={it.name} />
            ))
          ) : (
            graphs[0] ? <img className="img-box" src={`/${graphs[0].folder}/${graphs[0].file}`} alt={graphs[0].name} /> : <div>No graphs available</div>
          )}
        </div>

        <aside className="right-col">
          {shared.map(it => (
            <div key={it.file} style={{ width: 260, margin: '12px auto', display: 'block' }}>
              <ManifestItem item={it} />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}