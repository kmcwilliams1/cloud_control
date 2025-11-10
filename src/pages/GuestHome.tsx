import React, {useMemo} from 'react';
import {useManifest} from '../hooks/useManifest';
import ManifestItem from '../components/ManifestItem';

export default function GuestHome() {
    const {items, loading, error} = useManifest(['/notGraphs/manifest.json']);
    const shared = items.filter(i => i.folder === 'notGraphs');

    if (loading) {
        return (
            <div className="page">
                <h2 className="summary-title">SHARED WITH YOU</h2>
                <div className="loading">Loading…</div>
            </div>
        );
    }

    return (
        <div className="page">
            {loading ? <div className="loading">Loading…</div> : null}
            <h2 className="summary-title" style={{display: 'flex',justifyContent: 'center'}}>SHARED WITH YOU</h2>
            <a href="/account" style={{textAlign: 'right', position: 'absolute', top: 10, right: 10}}>
                <img
                    src={'/settings-glyph-black-icon-png_292947.jpg'}
                    alt={'Settings'}
                    style={{width: 60, height: 60, cursor: 'pointer'}}
                />
            </a>
            <div className="manifest-row" style={{display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',  alignItems: 'flex-start'}}>
                {shared.map(it => (
                    <div key={it.file} className="manifest-item">
                        <ManifestItem item={it}/>
                    </div>
                ))}
            </div>
        </div>
    );
}