// File: `src/hooks/useManifest.tsx`
import { useEffect, useState } from 'react';

export type ManifestItem = {
  folder: string;
  file: string;
  name: string;
  type?: 'image' | 'video' | 'text' | string;
  provider?: string;
  [key: string]: any;
};

function normalizeEntry(entry: any, defaultFolder = ''): ManifestItem | null {
  if (entry == null) return null;
  // entry can be a string filename or an object
  if (typeof entry === 'string') {
    const file = entry;
    const name = file.replace(/\.[^.]+$/, '').toUpperCase();
    return { folder: defaultFolder, file, name };
  }
  if (typeof entry === 'object' && entry.file) {
    return {
      folder: entry.folder ?? defaultFolder,
      file: entry.file,
      name: entry.name ?? String(entry.file),
      type: entry.type,
      provider: entry.provider,
      ...entry,
    };
  }
  return null;
}

export function useManifest(manifestPath: string | string[] = '/manifest.json') {
  const [items, setItems] = useState<ManifestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(false);
    setError(null);

    const paths = Array.isArray(manifestPath) ? manifestPath : [manifestPath];

    Promise.all(
      paths.map((p) =>
        fetch(p)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    )
      .then((rawResults: (unknown | null)[]) => {
        if (cancelled) return;

        // flatten arrays/objects from each manifest file
        const allEntries: unknown[] = rawResults.flatMap((raw, idx) => {
          // raw might be an array or an object with `items`
          const obj = raw as unknown;
          if (Array.isArray(obj)) return obj;
          if (obj && typeof obj === 'object' && (obj as any).items && Array.isArray((obj as any).items)) {
            return (obj as any).items;
          }
          // also support object that contains top-level entries keyed by folder
          if (obj && typeof obj === 'object') {
            // attempt to extract values that look like items
            return Object.values(obj).flatMap((v) => (Array.isArray(v) ? v : []));
          }
          return [];
        });

        const normalized = (allEntries as any[])
          .map((e) => {
            // try to infer folder from path if entry is string like "folder/file.png"
            if (typeof e === 'string') {
              const parts = e.split('/');
              const file = parts.pop() || e;
              const folder = parts.join('/') || '';
              return normalizeEntry(file, folder);
            }
            // object entry may include a folder property; use empty string as default
            return normalizeEntry(e, '');
          })
          .filter((x): x is ManifestItem => x !== null)
          .sort((a: ManifestItem, b: ManifestItem) =>
            a.folder !== b.folder ? a.folder.localeCompare(b.folder) : a.name.localeCompare(b.name)
          );

        setItems(normalized);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(String(err || 'Failed to load manifest(s)'));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [manifestPath]);

  return { items, loading, error };
}

export default useManifest;