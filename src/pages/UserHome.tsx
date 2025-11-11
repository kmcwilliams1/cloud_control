// typescript
      import React, { JSX, useState, useMemo } from 'react';
      import { useManifest, type ManifestItem as MI } from '../hooks/useManifest';
      import ActionPicker from '../components/ActionPicker';
      import ManifestItem from '../components/ManifestItem';
      import ResourcesPopup from '../components/ResourcesPopup';
      import InstanceSummaryPopup from '../components/EC2computations';
      import type { InstanceSummary } from '../InstanceSummary';
      import { screenshot54 } from '../InstanceSummary';
      import { useAuth } from '../contexts/AuthContext'; // read user role

      const providerOrder: MI['provider'][] = ['aws', 'gcp', 'azure'];

      export default function UserHome(): JSX.Element {
        const publicBase = process.env.PUBLIC_URL || '';
        const { items, loading } = useManifest(['/graphs/manifest.json', '/notGraphs/manifest.json']);
        const [pickerVisible, setPickerVisible] = useState(false);
        const [selectedItem, setSelectedItem] = useState<MI | null>(null);
        const [resourcesVisible, setResourcesVisible] = useState(false);
        const [resourcesProvider, setResourcesProvider] = useState<string | undefined>(undefined);

        // instance popup state
        const [instancePopupVisible, setInstancePopupVisible] = useState(false);
        const [instanceData, setInstanceData] = useState<InstanceSummary | null>(null);

        const { user } = useAuth() || { user: undefined }; // expects your AuthContext to expose user
        const role = (user && (user as any).role) ? String((user as any).role).toLowerCase() : 'user';

        const openPicker = (it: MI) => {
          setSelectedItem(it);
          setPickerVisible(true);
        };

        const handleSubmit = (action: 'open' | 'share', it: MI) => {
          const url = `${publicBase}/${it.folder}/${it.file}`;
          if (action === 'open') {
            if ((it.name || '').toLowerCase().includes('ec2')) {
              setInstanceData(screenshot54);
              setInstancePopupVisible(true);
              return;
            }
            window.open(url, '_blank');
            return;
          }
          console.log('share', it, url);
          alert(`Share: ${url}`);
        };

        const allowedForUser = (it: MI) => {
          const anyIt = it as any;
          if (Array.isArray(anyIt.roles) && anyIt.roles.length > 0) {
            if (anyIt.roles.includes('admin')) {
              return role === 'admin';
            }
            return anyIt.roles.map((r: any) => String(r).toLowerCase()).includes(role) || role === 'admin';
          }
          if (typeof anyIt.access === 'string') {
            const access = String(anyIt.access).toLowerCase();
            if (access === 'public') return true;
            if (access === 'admin') return role === 'admin';
            return access === role || role === 'admin';
          }
          return true;
        };

        const filteredItems = useMemo(() => {
          return items.filter((it: MI) => allowedForUser(it));
        }, [items, role]);

        if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

        return (
          <div style={{ padding: 5, minHeight: '100vh', fontFamily: 'Montserrat, Arial' }}>
            <h1 style={{ textAlign: 'center', fontSize: 36, letterSpacing: 6 }}>SUMMARY</h1>
            <a href={`${publicBase}/account`} style={{ textAlign: 'right', position: 'absolute', top: 10, right: 10 }}>
              <img src={`${publicBase}/settings-glyph-black-icon-png_292947.jpg`} alt={'Settings'} style={{ width: 40, height: 40, cursor: 'pointer' }} />
            </a>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
              {providerOrder.map((p) => (
                <section key={p} style={{ padding: 5, borderRight: '1px solid #000000', textAlign: 'center' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #000000',
                    paddingBottom: 8
                  }}>
                    <div style={{ fontSize: 32, letterSpacing: 6 }}>{(p || '').toUpperCase()}</div>

                    {p === 'aws' ? (
                      <button
                        onClick={() => {
                          setResourcesProvider('aws');
                          setResourcesVisible(true);
                        }}
                      >
                        Resources
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setResourcesProvider(p);
                          setResourcesVisible(true);
                        }}
                      >
                        Resources
                      </button>
                    )}
                  </div>

                  <div>
                    {(() => {
                      const providerItems = filteredItems.filter((it: MI) => (it.provider || '').toLowerCase() === (p || '').toLowerCase());
                      const graphsForP = providerItems.filter((it: MI) => it.folder === 'graphs');
                      const notGraphsForP = providerItems.filter((it: MI) => it.folder === 'notGraphs');
                      return (
                        <>
                          {graphsForP.map((it: MI) => (
                            <a
                              key={`${it.folder}/${it.file}`}
                              href={`${publicBase}/${it.folder}/${it.file}`}
                              onClick={(e) => {
                                e.preventDefault();
                                openPicker(it);
                              }}
                            >
                              <img src={`${publicBase}/${it.folder}/${it.file}`} alt={it.name}
                                   style={{ width: 300, flexWrap: 'wrap' }} />
                            </a>
                          ))}
                          <div style={{ height: 12 }} />
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8,
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                          }}>
                            {notGraphsForP.map((it: MI) => (
                              <a
                                key={`${it.folder}/${it.file}`}
                                href={`${publicBase}/${it.folder}/${it.file}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  openPicker(it);
                                }}
                                style={{
                                  margin: 4,
                                  width: 130,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  textDecoration: 'none',
                                  color: 'inherit',
                                }}
                              >
                                <p style={{
                                  margin: '4px 0',
                                  width: 130,
                                  textAlign: 'center',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {it.name}
                                </p>
                                <img src={`${publicBase}/${it.folder}/${it.file}`} alt={it.name}
                                     style={{ width: 130, height: 'auto', display: 'block' }} />
                              </a>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <button style={{ textAlign: 'center' }} onClick={() => {
                    const url =
                      p === 'aws'
                        ? 'https://aws.amazon.com'
                        : p === 'azure'
                          ? 'https://azure.microsoft.com'
                          : p === 'gcp'
                            ? 'https://cloud.google.com'
                            : '#';
                    window.open(url, '_blank');
                  }}>
                    {(p + ' Dashboard' || '').toUpperCase()}
                  </button>
                </section>
              ))}
            </div>

            <ActionPicker item={selectedItem} visible={pickerVisible} onClose={() => setPickerVisible(false)} onSubmit={(action, it) => { handleSubmit(action, it); setPickerVisible(false); }} />

            <ResourcesPopup visible={resourcesVisible} provider={resourcesProvider} onClose={() => { setResourcesVisible(false); setResourcesProvider(undefined); }} />

            <InstanceSummaryPopup visible={instancePopupVisible} instance={instanceData} onClose={() => { setInstancePopupVisible(false); setInstanceData(null); }} />
          </div>
        );
      }