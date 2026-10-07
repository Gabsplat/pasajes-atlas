import React, {useEffect, useRef, useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import type {Data} from './types';

export const nf = new Intl.NumberFormat('es-AR');
export const pct = (v: number) => `${nf.format(v)} %`;
export const fig = (v: number | string) => (typeof v === 'number' ? nf.format(v) : v);
export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function download(name: string, text: string, type = 'application/json') {
  const u = URL.createObjectURL(new Blob([text], {type}));
  const a = document.createElement('a');
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 2000);
}

export function csv(header: string[], rows: (string | number | null)[][]) {
  return [header, ...rows].map(r => r.map(c => (c === null ? '' : typeof c === 'string' && /[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n');
}

export function Cite({ids, data}: {ids: string[]; data: Data}) {
  return (
    <div className="citations">
      {ids.map(id => {
        const s = data.sources.find(x => x.id === id);
        return s && <a key={id} href={s.url} target="_blank" rel="noreferrer" title={s.title}><ArrowUpRight size={13} />{s.author}</a>;
      })}
    </div>
  );
}

// Ancho real del contenedor, para que los gráficos SVG mantengan tipografía legible en móvil.
export function useWidth<T extends HTMLElement>(fallback = 900) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(e => setW(Math.max(280, Math.round(e[0].contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}
