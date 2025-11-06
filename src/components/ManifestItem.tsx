import React, { useEffect, useMemo, useState } from 'react';
                  import type { ManifestItem as ManifestItemType } from '../hooks/useManifest';

                  type Props = { item: ManifestItemType; onOpen?: (it: ManifestItemType) => void };

                  function ManifestItemCardInner({ item, onOpen }: Props) {
                    const src = useMemo(() => `/${item.folder}/${item.file}`, [item.folder, item.file]);
                    const type = useMemo(() => item.type || (item.folder === 'graphs' ? 'image' : undefined), [item.type, item.folder]);

                    const [text, setText] = useState<string | null>(null);

                    useEffect(() => {
                      if (type !== 'text') return;

                      const ac = new AbortController();
                      setText(null); // show loading for a new src
                      fetch(src, { signal: ac.signal })
                        .then(r => (r.ok ? r.text() : ''))
                        .then(t => {
                          if (!ac.signal.aborted) setText(t);
                        })
                        .catch(err => {
                          if (err.name === 'AbortError') return;
                          if (!ac.signal.aborted) setText(null);
                        });

                      return () => ac.abort();
                    }, [src, type]);

                    const renderTextContent = () => {
                      if (text == null) return <div style={{ fontSize: 12, padding: 8 }}>{item.name}</div>;
                      const preview = text.length > 180 ? text.slice(0, 177) + '…' : text;
                      return <div style={{ fontSize: 12, padding: 8, textAlign: 'left', whiteSpace: 'pre-wrap' }}>{preview}</div>;
                    };

                    return (
                      <div style={{ width: 160, textAlign: 'center', margin: 12, cursor: 'pointer' }} onClick={() => onOpen?.(item)}>
                        {type === 'image' && <img src={src} alt={item.name} style={{ width: 128, height: 128, borderRadius: '50%' }} />}
                        {type === 'video' && (
                          <div style={{ width: 128, height: 128, borderRadius: '50%', background: '#8fb1ff', display: 'grid', placeItems: 'center' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24"><path fill="#fff" d="M8 5v14l11-7z"/></svg>
                          </div>
                        )}
                        {type === 'text' && (
                          <div style={{ width: 128, height: 128, borderRadius: '12px', background: '#4aa0ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, overflow: 'hidden' }}>
                            {renderTextContent()}
                          </div>
                        )}
                        <div style={{ marginTop: 12, fontWeight: 800, letterSpacing: 3 }}>{item.name}</div>
                      </div>
                    );
                  }

                  // custom comparator: avoid re-render when item identity changes but values are the same
                  export default React.memo(ManifestItemCardInner, (prev, next) =>
                    prev.onOpen === next.onOpen &&
                    prev.item.file === next.item.file &&
                    prev.item.folder === next.item.folder &&
                    prev.item.type === next.item.type &&
                    prev.item.name === next.item.name
                  );