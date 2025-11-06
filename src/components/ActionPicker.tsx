import React, { useState } from 'react';
import type { ManifestItem } from '../hooks/useManifest';

type Props = {
  item: ManifestItem | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (action: 'open' | 'share', item: ManifestItem) => void;
};

export default function ActionPicker({ item, visible, onClose, onSubmit }: Props) {
  const [action, setAction] = useState<'open' | 'share'>('open');

  if (!visible || !item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        background: '#fff',
        border: '1px solid #ddd',
        padding: 16,
        borderRadius: 8,
        zIndex: 9999,
        minWidth: 280,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div style={{ fontWeight: 800, marginBottom: 8 }}>{item.name}</div>

      <label style={{ display: 'block', marginBottom: 6 }}>
        <input
          type="radio"
          name="action"
          value="open"
          checked={action === 'open'}
          onChange={() => setAction('open')}
          style={{ marginRight: 8 }}
        />
        Open
      </label>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <input
          type="radio"
          name="action"
          value="share"
          checked={action === 'share'}
          onChange={() => setAction('share')}
          style={{ marginRight: 8 }}
        />
        Share with
      </label>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ padding: '6px 10px' }}>
          Cancel
        </button>
        <button
          onClick={() => {
            onSubmit(action, item);
            onClose();
          }}
          style={{ padding: '6px 12px', fontWeight: 700 }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}