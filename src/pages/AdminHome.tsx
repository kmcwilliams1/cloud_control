// File: src/pages/AdminHome.tsx
import React, { JSX, useState } from 'react';
import { useManifest, type ManifestItem as MI } from '../hooks/useManifest';
import ActionPicker from '../components/ActionPicker';
import ManifestItem from '../components/ManifestItem';
import ResourcesPopup from '../components/ResourcesPopup';
import InstanceSummaryPopup from '../components/EC2computations';
import type { InstanceSummary } from '../InstanceSummary';
import { screenshot54 } from '../InstanceSummary';

const providerOrder: MI['provider'][] = ['aws', 'gcp', 'azure'];

export default function AdminHome(): JSX.Element {
    const {items, loading} = useManifest(['/graphs/manifest.json', '/notGraphs/manifest.json']);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MI | null>(null);
    const [resourcesVisible, setResourcesVisible] = useState(false);
    const [resourcesProvider, setResourcesProvider] = useState<string | undefined>(undefined);

    // instance popup state
    const [instancePopupVisible, setInstancePopupVisible] = useState(false);
    const [instanceData, setInstanceData] = useState<InstanceSummary | null>(null);

    const openPicker = (it: MI) => {
        setSelectedItem(it);
        setPickerVisible(true);
    };

    const handleSubmit = (action: 'open' | 'share', it: MI) => {
        // if admin selected "open" on the EC2 Computation item, show the instance summary popup
        if (action === 'open') {
            if ((it.name || '').toLowerCase().includes('ec2')) {
                // use sample instance data (screenshot54) for the demo item
                setInstanceData(screenshot54);
                setInstancePopupVisible(true);
                return;
            }
            // fallback: open resource in new tab
            const url = `/${it.folder}/${it.file}`;
            window.open(url, '_blank');
            return;
        }

        // share action
        const url = `/${it.folder}/${it.file}`;
        console.log('share', it, url);
        alert(`Share: ${url}`);
    };

    if (loading) return <div style={{padding: 24}}>Loading…</div>;

    return (
        <div style={{padding: 5, minHeight: '100vh', fontFamily: 'Montserrat, Arial'}}>
            <h1 style={{textAlign: 'center', fontSize: 36, letterSpacing: 6}}>SUMMARY</h1>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0}}>
                {providerOrder.map((p) => (
                    <section key={p} style={{padding: 5, borderRight: '1px solid #000000', textAlign: 'center'}}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #000000',
                            paddingBottom: 8
                        }}>

                            <div style={{
                                fontSize: 32,
                                letterSpacing: 6,
                            }}>{(p || '').toUpperCase()}</div>

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
                                        const url = p === 'aws' ? 'https://aws.amazon.com' : p === 'azure' ? 'https://azure.microsoft.com' : p === 'gcp' ? 'https://cloud.google.com' : '#';
                                        window.open(url, '_blank');
                                    }}
                                >
                                    Resources
                                </button>
                            )}

                        </div>
                        <div>

                            {(() => {
                                const providerItems = items.filter(
                                    (it: MI) => (it.provider || '').toLowerCase() === (p || '').toLowerCase()
                                );
                                const graphsForP = providerItems.filter((it: MI) => it.folder === 'graphs');
                                const notGraphsForP = providerItems.filter((it: MI) => it.folder === 'notGraphs');
                                return (
                                    <>
                                        {graphsForP.map((it: MI) => (
                                            <a
                                                key={`${it.folder}/${it.file}`}
                                                href={`/${it.folder}/${it.file}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    openPicker(it);
                                                }}
                                            >
                                                <img
                                                    src={`/${it.folder}/${it.file}`}
                                                    alt={it.name}
                                                    style={{width: 300, flexWrap: 'wrap'}}
                                                />
                                            </a>
                                        ))}
                                        <div style={{height: 12}}/>
                                        {notGraphsForP.map((it: MI) => (
                                            <a
                                                key={`${it.folder}/${it.file}`}
                                                href={`/${it.folder}/${it.file}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    openPicker(it);
                                                }}
                                                style={{margin: '5px auto', width: 130, flexWrap: 'wrap'}}
                                            >
                                                <p style={{
                                                    margin: '5px auto',
                                                    width: 130,
                                                    flexWrap: 'wrap'
                                                }}>{it.name}</p>
                                                <img
                                                    src={`/${it.folder}/${it.file}`}
                                                    alt={it.name}
                                                    style={{margin: '5px auto', width: 130, flexWrap: 'wrap'}}
                                                />
                                            </a>
                                        ))}
                                    </>
                                );
                            })()}
                        </div>

                        <button style={{textAlign: 'center'}} key={p} onClick={() => {
                            const url = p === 'aws' ? 'https://aws.amazon.com' : p === 'azure' ? 'https://azure.microsoft.com' : p === 'gcp' ? 'https://cloud.google.com' : '#';
                            window.open(url, '_blank');
                        }}>{(p + " Dashboard" || '').toUpperCase()}</button>
                    </section>
                ))}
            </div>

            <ActionPicker
                item={selectedItem}
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                onSubmit={(action, it) => {
                  handleSubmit(action, it);
                  setPickerVisible(false);
                }}
            />

            <ResourcesPopup
                visible={resourcesVisible}
                provider={resourcesProvider}
                onClose={() => {
                    setResourcesVisible(false);
                    setResourcesProvider(undefined);
                }}
            />

            <InstanceSummaryPopup
              visible={instancePopupVisible}
              instance={instanceData}
              onClose={() => {
                setInstancePopupVisible(false);
                setInstanceData(null);
              }}
            />
        </div>
    );
}