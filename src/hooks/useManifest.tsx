// typescript
      // File: `src/hooks/useManifest.tsx`
      import { useEffect, useRef, useState } from 'react';

      export type ManifestItem = {
          provider?: string;
          folder?: string;
          file?: string;
          name?: string;
          roles?: string[] | any[];
          access?: string;
          [k: string]: any;
      };

      type CacheEntry = {
          items: ManifestItem[] | null;
          promise?: Promise<ManifestItem[]>;
          timestamp: number;
      };

      const cache = new Map<string, CacheEntry>();

      const makeKey = (paths: string[]) => paths.map((p) => p || '').join('|');

      export function useManifest(paths: string[]): {
          items: ManifestItem[];
          loading: boolean;
          error: string | null;
          refetch: () => void;
      } {
          const base = process.env.PUBLIC_URL || '';
          const key = makeKey(paths);
          const mounted = useRef(true);

          const [items, setItems] = useState<ManifestItem[]>(() => {
              const entry = cache.get(key);
              return entry && entry.items ? entry.items : [];
          });
          const [loading, setLoading] = useState<boolean>(() => {
              const entry = cache.get(key);
              return !entry || !entry.items;
          });
          const [error, setError] = useState<string | null>(null);

          const load = async (force = false) => {
              if (!paths || paths.length === 0) {
                  setItems([]);
                  setLoading(false);
                  setError(null);
                  return;
              }

              const existing = cache.get(key);
              if (existing && existing.items && !force) {
                  setItems(existing.items);
                  setLoading(false);
                  setError(null);
                  return;
              }

              // reuse in-flight promise when available
              if (existing && existing.promise && !force) {
                  setLoading(true);
                  setError(null);
                  try {
                      const result = await existing.promise;
                      if (!mounted.current) return;
                      setItems(result);
                      setLoading(false);
                  } catch (e: any) {
                      if (!mounted.current) return;
                      setError(e?.message || 'Error loading manifest');
                      setLoading(false);
                  }
                  return;
              }

              // create a fresh promise for dedupe. Do NOT attach a shared AbortController here
              const promise = (async () => {
                  try {
                      const fetches = paths.map(async (p) => {
                          const path = p.startsWith('/') ? `${base}${p}` : `${base}/${p}`;
                          const res = await fetch(path, { cache: 'default' });
                          const text = await res.text();
                          const ct = (res.headers.get('content-type') || '').toLowerCase();

                          if (!res.ok) {
                              throw new Error(`Failed to load manifest (${res.status}) from ${path}. Response snippet: ${text.slice(0, 200)}`);
                          }

                          if (ct.includes('html') || text.trim().startsWith('<')) {
                              throw new Error(`Invalid JSON from ${path}: response appears to be HTML. Response snippet: ${text.slice(0, 200)}`);
                          }

                          try {
                              const parsed = JSON.parse(text);
                              if (Array.isArray(parsed)) return parsed as ManifestItem[];
                              if (Array.isArray((parsed as any).items)) return (parsed as any).items as ManifestItem[];
                              if (Array.isArray((parsed as any).manifest)) return (parsed as any).manifest as ManifestItem[];
                              return Object.values(parsed).flat().filter(Boolean) as ManifestItem[];
                          } catch (err) {
                              throw new Error(`Invalid JSON from ${path}: ${(err as Error).message}. Response snippet: ${text.slice(0, 200)}`);
                          }
                      });

                      const results = await Promise.all(fetches);
                      const flattened = results.flat();
                      cache.set(key, { items: flattened, promise: undefined, timestamp: Date.now() });
                      return flattened;
                  } catch (e) {
                      // remove stale promise on error so future attempts can retry
                      const cur = cache.get(key);
                      if (cur && cur.promise) cache.delete(key);
                      throw e;
                  }
              })();

              // store promise to dedupe concurrent requests
              cache.set(key, { items: null, promise, timestamp: Date.now() });

              setLoading(true);
              setError(null);

              try {
                  const result = await promise;
                  if (!mounted.current) return;
                  setItems(result);
                  setLoading(false);
              } catch (e: any) {
                  if (!mounted.current) return;
                  setError(e?.message || 'Error loading manifest');
                  setLoading(false);
              }
          };

          useEffect(() => {
              mounted.current = true;
              load(false);
              return () => {
                  // Do not abort the shared promise's network request here.
                  // Just mark this hook instance as unmounted so results are ignored.
                  mounted.current = false;
              };
              // key is a stable representation of paths
          }, [key]);

          const refetch = () => {
              cache.delete(key);
              load(true);
          };

          return { items, loading, error, refetch };
      }