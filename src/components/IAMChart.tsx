import React from 'react';

type Group = {
    id: number;
    name: string;
    permissions: string[]; // e.g. ['AWS','GCP','AZURE']
};

const defaultGroups: Group[] = [
    {id: 0, name: 'Accounting', permissions: ['AWS', 'GCP', 'AZURE']},
    {id: 1, name: 'Sales', permissions: ['AWS', 'GCP', 'AZURE']},
    {id: 2, name: 'HR', permissions: ['AWS', 'GCP', 'AZURE']},
];

const providerColors: Record<string, string> = {
    AWS: '#F6E08A', // pale yellow
    GCP: '#CFE9FF', // pale blue
    AZURE: '#C7E9C9', // pale green
};

export default function IAMChart({
                                     groups = defaultGroups,
                                     onPermissionClick,
                                 }: {
    groups?: Group[];
    // now include group id so parent knows which group opened the provider panel
    onPermissionClick?: (groupId: number, permission: string) => void;
}) {
    return (
        <div style={{
            fontFamily: 'Montserrat, Arial, sans-serif',
            maxWidth: 880,
            margin: '0 auto',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
        }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
            }}>
                <thead>
                <tr>
                    <th style={headerCellStyle}>ID</th>
                    <th style={headerCellStyle}>Group Name</th>
                    <th style={headerCellStyle}>Permission List</th>
                </tr>
                </thead>

                <tbody>
                {groups.map((g, idx) => (
                    <tr key={g.id} style={{borderTop: idx === 0 ? '1px solid #222' : '1px solid #bbb'}}>
                        <td style={idCellStyle}>{g.id}</td>
                        <td style={nameCellStyle}>{g.name}</td>
                        <td style={{padding: 12}}>
                            <div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end'}}>
                                <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                                    {g.permissions.map((p) => {
                                        const label = (p || '').toUpperCase();
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => onPermissionClick && onPermissionClick(g.id, p)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: 8,
                                                    border: '1px solid rgba(0,0,0,0.08)',
                                                    background: providerColors[label] || '#fff',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    cursor: 'pointer'
                                                }}
                                                aria-label={`Open ${label} resources for ${g.name}`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

/* inline style helpers */
const headerCellStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px 16px',
    background: '#fff',
    borderBottom: '3px solid #222',
    fontWeight: 800,
    fontSize: 14,
};

const idCellStyle: React.CSSProperties = {
    padding: '18px 16px',
    width: 60,
    textAlign: 'center',
    fontSize: 16,
};

const nameCellStyle: React.CSSProperties = {
    padding: '18px 16px',
    fontSize: 18,
    fontWeight: 600,
};