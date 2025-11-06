
import React from 'react';
import { useManifest } from '../hooks/useManifest';
import ManifestItem from '../components/ManifestItem';
import { ManifestItem as MI } from '../hooks/useManifest';

const providerOrder: MI['provider'][] = ['aws', 'gcp', 'azure'];

export default function AdminHome() {
  // load both manifests via hook
  const { items, loading } = useManifest(['/graphs/manifest.json', '/notGraphs/manifest.json']);

  const graphs = items.filter(i => i.folder === 'graphs');
  const notGraphs = items.filter(i => i.folder === 'notGraphs');

  const byProvider = (p?: string) => graphs.filter(g => (g.provider || '').toLowerCase() === (p || '').toLowerCase());

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <div style={{ padding: 24, minHeight: '100vh', fontFamily: 'Montserrat, Arial' }}>
      <h1 style={{ textAlign: 'center', fontSize: 36, letterSpacing: 6 }}>SUMMARY</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
        {providerOrder.map(p => (
          <section key={p} style={{ padding: 24, borderRight: '1px solid #ddd', textAlign: 'center' }}>
            <div style={{ fontSize: 28, letterSpacing: 6 }}>{(p || '').toUpperCase()}</div>
            <div>
              {byProvider(p).map(it => <img key={it.file} src={`/${it.folder}/${it.file}`} alt={it.name} style={{ width: 260, margin: '12px auto', display: 'block' }} />)}
            </div>
          </section>
        ))}
      </div>

      <h2 style={{ marginTop: 40, textAlign: 'center' }}>SHARED WITH YOU</h2>
      <div style={{ display: 'flex', gap: 8, padding: 20, flexWrap: 'wrap' }}>
        {notGraphs.map(it => <ManifestItem key={it.file} item={it} />)}
      </div>
    </div>
  );
}