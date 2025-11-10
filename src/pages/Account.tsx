import React, { JSX, useEffect, useState } from 'react';
import IAMChart from '../components/IAMChart';
import APIChart from '../components/APIChart';

type View = 'iam' | 'api' | 'info' | null;
type Category = { name: string; services: string[] };

export default function Account(): JSX.Element {
    const [view, setView] = useState<View>(null);

    // panel state for inline resources (IAM view)
    const [panelProvider, setPanelProvider] = useState<string | null>(null);
    const [panelGroupId, setPanelGroupId] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [resLoading, setResLoading] = useState(false);
    const [resError, setResError] = useState<string | null>(null);

    // disabled resources per group (Set of keys "provider::resourceName")
    const [disabledResourcesByGroup, setDisabledResourcesByGroup] = useState<Record<number, Set<string>>>({});

    useEffect(() => {
        if (!panelProvider) {
            setCategories(null);
            setResLoading(false);
            setResError(null);
            return;
        }

        const key = panelProvider.toLowerCase().trim();
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
            setResError(`No resources file mapped for provider: ${panelProvider}`);
            return;
        }

        setResLoading(true);
        setResError(null);
        fetch(url)
            .then((r) => {
                if (!r.ok) throw new Error(`Failed to load services (${r.status})`);
                return r.json();
            })
            .then((data) => {
                setCategories(data.categories || []);
                setResLoading(false);
            })
            .catch((err) => {
                setResError(err.message || 'Error');
                setResLoading(false);
            });
    }, [panelProvider]);

    const bg = '#f2f1ec'; // page background similar to screenshot
    const pink = '#e8c9c3';

    const Button: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
        <button
            onClick={onClick}
            style={{
                background: '#000',
                color: '#fff',
                padding: '18px 44px',
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 800,
                border: '3px solid rgba(255,255,255,0.06)',
                boxShadow: '0 3px 0 rgba(0,0,0,0.4), 0 0 0 4px rgba(0,0,0,0.04) inset',
                cursor: 'pointer',
                minWidth: 220,
            }}
            aria-pressed={false}
        >
            {children}
        </button>
    );

    const normalizeProvider = (permission: string): string | null => {
        const k = permission.toLowerCase();
        if (k === 'aws' || k === 'amazon') return 'aws';
        if (k === 'gcp' || k === 'google') return 'gcp';
        if (k === 'azure' || k === 'microsoft' || k === 'az') return 'azure';
        return null;
    };

    // now receives groupId so Account knows which group's panel is open
    const handlePermissionClick = (groupId: number, permission: string) => {
        const normalized = normalizeProvider(permission);
        setPanelGroupId(groupId);
        setPanelProvider(normalized); // will be null if not matched which clears the panel
    };

    const makeDisabledKey = (prov: string, resource: string) => `${prov || 'unknown'}::${resource}`;

    const toggleResourceForGroup = (resource: string) => {
        if (panelGroupId === null || !panelProvider) return;
        const key = makeDisabledKey(panelProvider, resource);
        setDisabledResourcesByGroup((prev) => {
            const copy: Record<number, Set<string>> = { ...prev };
            const setForGroup = new Set(copy[panelGroupId] ? Array.from(copy[panelGroupId]) : []);
            if (setForGroup.has(key)) {
                setForGroup.delete(key);
            } else {
                setForGroup.add(key);
            }
            copy[panelGroupId] = setForGroup;
            return copy;
        });
    };

    const isResourceDisabled = (resource: string) => {
        if (panelGroupId === null || !panelProvider) return false;
        const key = makeDisabledKey(panelProvider, resource);
        return !!(disabledResourcesByGroup[panelGroupId] && disabledResourcesByGroup[panelGroupId].has(key));
    };

    const renderContent = () => {
        if (!view) {
            return (
                <div style={{ color: '#666', fontSize: 18 }}>
                    Select an option above to view details.
                </div>
            );
        }

        if (view === 'iam') {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>
                    <div style={{ padding: 6 }}>
                        <h2 style={{ marginTop: 0 }}>IAM / Permissions</h2>
                        <p style={{ marginTop: 6, color: '#444' }}>Manage users, roles and policies.</p>
                        <div style={{ marginTop: 12 }}>
                            <IAMChart onPermissionClick={handlePermissionClick} />
                        </div>
                    </div>

                    <div style={{
                        padding: 12,
                        minHeight: 300,
                        borderRadius: 8,
                        background: '#fff',
                        border: '1px dashed #e0e0e0',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ fontWeight: 800 }}>
                                {panelProvider ? `${panelProvider.toUpperCase()} Resources` : 'Details'}
                                {panelGroupId !== null && <span style={{ marginLeft: 12, fontWeight: 600, color: '#666' }}> — Group {panelGroupId}</span>}
                            </div>
                            <div>
                                <button
                                    onClick={() => { setPanelProvider(null); setPanelGroupId(null); }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: 16,
                                        cursor: 'pointer',
                                        padding: 6
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {panelProvider && (
                            <>
                                {resLoading && <div style={{ padding: 8 }}>Loading…</div>}
                                {resError && <div style={{ color: 'crimson', padding: 8 }}>{resError}</div>}
                                {!resLoading && !resError && categories && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: 12
                                    }}>
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
                                                        const disabled = isResourceDisabled(s);
                                                        return (
                                                            <li key={s} style={{ marginBottom: 6 }}>
                                                                <a
                                                                    href="#"
                                                                    onClick={(e) => { e.preventDefault(); toggleResourceForGroup(s); }}
                                                                    style={{
                                                                        color: disabled ? '#777' : '#0067b8',
                                                                        textDecoration: disabled ? 'line-through' : 'none',
                                                                        textDecorationColor: disabled ? '#000' : undefined,
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    aria-pressed={disabled}
                                                                >
                                                                    {s}
                                                                </a>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!resLoading && !resError && !categories && (
                                    <div style={{ color: '#666' }}>No resources found.</div>
                                )}
                            </>
                        )}

                        {!panelProvider && (
                            <div style={{ color: '#777' }}>
                                Select a permission (for example, click AWS, GCP, or Azure) to show resources here.
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (view === 'api') {
            return <APIChart />;
        }

return (
    <div>
        <h2 style={{ marginTop: 0 }}>Account Info</h2>
        <p>Profile, billing, and contact details.</p>

        {/* Interactive Edit Info Panel (self-contained nested component) */}
        {(() => {
            const EditInfoPanel: React.FC = () => {
                const [editing, setEditing] = React.useState(false);
                const [saving, setSaving] = React.useState(false);
                const [message, setMessage] = React.useState<string | null>(null);

                const [saved, setSaved] = React.useState({
                    company: 'Acme Corp',
                    email: 'admin@email.com',
                    phone: '555-123-4567',
                });

                const [form, setForm] = React.useState({ ...saved });
                const [errors, setErrors] = React.useState<{ email?: string }>({});

                const validate = () => {
                    const e: { email?: string } = {};
                    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                        e.email = 'Enter a valid email address';
                    }
                    setErrors(e);
                    return Object.keys(e).length === 0;
                };

                const handleChange = (k: keyof typeof form) => (ev: React.ChangeEvent<HTMLInputElement>) => {
                    setForm((s) => ({ ...s, [k]: ev.target.value }));
                };

                const handleSave = () => {
                    if (!validate()) return;
                    setSaving(true);
                    setMessage(null);
                    // simulate network save
                    setTimeout(() => {
                        setSaved({ ...form });
                        setSaving(false);
                        setEditing(false);
                        setMessage('Changes saved.');
                        setTimeout(() => setMessage(null), 3000);
                    }, 800);
                };

                const handleCancel = () => {
                    setForm({ ...saved });
                    setErrors({});
                    setEditing(false);
                    setMessage('Edits canceled.');
                    setTimeout(() => setMessage(null), 2000);
                };

                return (
                    <div style={{ marginTop: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ fontWeight: 700 }}>Profile</div>
                            <div>
                                {!editing ? (
                                    <button
                                        onClick={() => setEditing(true)}
                                        style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer', background: '#000', color: '#fff', fontWeight: 700 }}
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            style={{ padding: '8px 14px', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', background: '#0067b8', color: '#fff', marginRight: 8, fontWeight: 700 }}
                                        >
                                            {saving ? 'Saving…' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            disabled={saving}
                                            style={{ padding: '8px 12px', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', background: 'transparent', border: '1px solid #ddd' }}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {message && <div style={{ marginBottom: 12, color: '#006700', fontWeight: 700 }}>{message}</div>}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div style={{ padding: 12, background: '#fff', borderRadius: 8 }}>
                                <label style={{ display: 'block', color: '#666', fontSize: 12 }}>Company</label>
                                <input
                                    value={form.company}
                                    onChange={handleChange('company')}
                                    disabled={!editing || saving}
                                    style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #e6e6e6', fontSize: 14 }}
                                    aria-label="Company"
                                />
                                <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>This appears on invoices and reports.</div>
                            </div>

                            <div style={{ padding: 12, background: '#fff', borderRadius: 8 }}>
                                <label style={{ display: 'block', color: '#666', fontSize: 12 }}>Email</label>
                                <input
                                    value={form.email}
                                    onChange={handleChange('email')}
                                    disabled={!editing || saving}
                                    style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: errors.email ? '1px solid crimson' : '1px solid #e6e6e6', fontSize: 14 }}
                                    aria-label="Email"
                                />
                                {errors.email && <div style={{ color: 'crimson', marginTop: 6, fontSize: 12 }}>{errors.email}</div>}
                            </div>

                            <div style={{ padding: 12, background: '#fff', borderRadius: 8, gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', color: '#666', fontSize: 12 }}>Phone</label>
                                <input
                                    value={form.phone}
                                    onChange={handleChange('phone')}
                                    disabled={!editing || saving}
                                    style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 6, border: '1px solid #e6e6e6', fontSize: 14 }}
                                    aria-label="Phone"
                                />
                                <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>Used for account recovery and support calls.</div>
                            </div>
                        </div>
                    </div>
                );
            };

            return <EditInfoPanel />;
        })()}
    </div>
);
    };

    return (
        <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Montserrat, Arial, sans-serif' }}>
            <div style={{
                height: '33vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div
                    style={{
                        background: pink,
                        padding: '10px 48px',
                        borderRadius: 20,
                        letterSpacing: 8,
                        fontWeight: 800,
                        color: '#2b2726',
                        marginBottom: 28,
                        boxShadow: '0 2px 0 rgba(0,0,0,0.04)',
                    }}
                >
                    ACCOUNT
                </div>

                <div style={{
                    width: '100%',
                    padding: '0 6%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button onClick={() => setView('iam')}>Edit IAM</Button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={() => setView('api')}>Edit API</Button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => setView('info')}>Edit Info</Button>
                    </div>
                </div>
            </div>

            <div style={{
                height: '67vh',
                padding: '28px 6%',
                boxSizing: 'border-box',
                overflowY: 'auto',
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.6)',
                    borderRadius: 12,
                    padding: 20,
                    height: '100%',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};