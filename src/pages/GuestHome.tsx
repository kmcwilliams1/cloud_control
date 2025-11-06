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
            <h2 className="summary-title">SHARED WITH YOU</h2>
            <div className="manifest-row">
                {shared.map(it => (
                    <div key={it.file} className="manifest-item">
                        <ManifestItem item={it}/>
                    </div>
                ))}
            </div>
        </div>
    );
}