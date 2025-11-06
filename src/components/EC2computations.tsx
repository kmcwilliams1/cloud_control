// File: src/components/InstanceSummaryPopup.tsx
  import React from 'react';
  import type { InstanceSummary } from '../InstanceSummary';

  type Props = {
    visible: boolean;
    instance?: InstanceSummary | null;
    onClose: () => void;
  };

  export default function InstanceSummaryPopup({ visible, instance, onClose }: Props) {
    if (!visible || !instance) return null;

    return (
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 1300,
          padding: 24,
        }}
      >
        <div
          style={{
            width: 'min(900px, 96%)',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e6e6e6',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            padding: 18,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>
              Instance summary for {instance.instanceId} {instance.instanceName ? `(${instance.instanceName})` : ''}
            </h3>
            <button onClick={onClose} aria-label="Close instance summary" style={{ fontSize: 18, background: 'transparent', border: 'none', cursor: 'pointer' }}>
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Instance ID</div>
              <div style={{ color: '#222' }}>{instance.instanceId}</div>

              <div style={{ height: 12 }} />

              <div style={{ fontWeight: 700, marginBottom: 8 }}>Hostname type</div>
              <div>{instance.hostnameType || '-'}</div>

              <div style={{ height: 12 }} />

              <div style={{ fontWeight: 700, marginBottom: 8 }}>Auto-assigned IP</div>
              <div>{instance.autoAssignedIp || '-'}</div>

              <div style={{ height: 12 }} />

              <div style={{ fontWeight: 700, marginBottom: 8 }}>IAM Role</div>
              <div>{instance.iamRole ?? '-'}</div>
            </div>

            <div style={{ padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Public IPv4 address</div>
              <div>{instance.publicIpv4 || '-'}</div>

              <div style={{ height: 12 }} />

              <div style={{ fontWeight: 700, marginBottom: 8 }}>Instance state</div>
              <div style={{ color: instance.state === 'running' ? 'green' : 'crimson' }}>{instance.state}</div>

              <div style={{ height: 12 }} />

              <div style={{ fontWeight: 700, marginBottom: 8 }}>Instance type</div>
              <div>{instance.instanceType || '-'}</div>
            </div>

            <div style={{ padding: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Private IPv4 addresses</div>
              <div>{instance.privateIpv4 || '-'}</div>

              <div style={{ height: 12 }} />

              <div style={{ fontWeight: 700, marginBottom: 8 }}>Public IPv4 DNS</div>
              <div style={{ wordBreak: 'break-word' }}>{instance.publicDns || '-'}</div>

              <div style={{ height: 12 }} />

              <div style={{ fontWeight: 700, marginBottom: 8 }}>VPC / Subnet</div>
              <div>{instance.vpcId || '-'} / {instance.subnetId || '-'}</div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={onClose} style={{ padding: '6px 10px' }}>Close</button>
          </div>
        </div>
      </div>
    );
  }