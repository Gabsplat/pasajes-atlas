import React, {useMemo, useState} from 'react';
import * as d3 from 'd3';
import {nf, useWidth} from './lib';
import type {Era, SeriesRow, TimelineEvent} from './types';

const C = {arrivals: '#b8593c', departures: '#5f7f86', italian: '#c86645', spanish: '#b59b46', ink: '#303b33', muted: '#737970', line: '#dcded2'};
export type SeriesMode = 'total' | 'italian' | 'spanish' | 'compare';
const short = (v: number) => (v >= 1000 ? `${nf.format(Math.round(v / 1000))} mil` : nf.format(v));

/** Serie anual 1857-1924 con lectura por año, hitos y franja de época. */
export function SeriesChart({rows, events, mode, era, onYear}: {rows: SeriesRow[]; events: TimelineEvent[]; mode: SeriesMode; era?: Era; onYear?: (y: number) => void}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const height = width < 560 ? 280 : 380;
  const m = {t: 34, r: 14, b: 30, l: width < 560 ? 40 : 54};
  const series = useMemo(() => {
    const a = (r: SeriesRow) => (mode === 'italian' || mode === 'compare' ? r.italianIn : mode === 'spanish' ? r.spanishIn : r.immigrants);
    const b = (r: SeriesRow) => (mode === 'italian' ? r.italianOut : mode === 'spanish' ? r.spanishOut : mode === 'compare' ? r.spanishIn : r.emigrants);
    const names = mode === 'compare' ? ['Italianos, entradas', 'Españoles, entradas'] : ['Entradas', 'Salidas'];
    const colors = mode === 'compare' ? [C.italian, C.spanish] : [C.arrivals, C.departures];
    return {a, b, names, colors};
  }, [mode]);
  const x = d3.scaleLinear().domain([rows[0].year, rows[rows.length - 1].year]).range([m.l, width - m.r]);
  const max = d3.max(rows, r => Math.max(series.a(r), series.b(r) ?? 0))!;
  const y = d3.scaleLinear().domain([0, max]).nice(5).range([height - m.b, m.t]);
  const area = d3.area<SeriesRow>().x(r => x(r.year)).y0(y(0)).y1(r => y(series.a(r))).curve(d3.curveMonotoneX);
  const lineA = d3.line<SeriesRow>().x(r => x(r.year)).y(r => y(series.a(r))).curve(d3.curveMonotoneX);
  const lineB = d3.line<SeriesRow>().defined(r => series.b(r) !== null).x(r => x(r.year)).y(r => y(series.b(r)!)).curve(d3.curveMonotoneX);
  const marks = events.filter(e => e.year >= rows[0].year && e.year <= rows[rows.length - 1].year && ['dato', 'crisis'].includes(e.kind));
  const row = hover !== null ? rows.find(r => r.year === hover)! : null;
  const pick = (clientX: number, el: SVGSVGElement) => {
    const b = el.getBoundingClientRect();
    const yr = Math.round(x.invert(((clientX - b.left) / b.width) * width));
    setHover(Math.max(rows[0].year, Math.min(rows[rows.length - 1].year, yr)));
  };
  const band = era && era.start <= 1924 ? [Math.max(era.start, 1857), Math.min(era.end, 1924)] : null;
  const tipLeft = row ? Math.min(Math.max(x(row.year) + 12, 4), width - 190) : 0;
  return (
    <div className="series-chart" ref={ref}>
      <div className="chart-legend">
        <span><i style={{background: series.colors[0]}} />{series.names[0]}</span>
        <span><i className="line" style={{background: series.colors[1]}} />{series.names[1]}</span>
        {mode !== 'compare' && <span className="legend-note">Las salidas se publican por año desde 1871</span>}
      </div>
      <svg width={width} height={height} role="img" aria-label="Entradas y salidas anuales de pasajeros de ultramar, 1857 a 1924" onMouseMove={e => pick(e.clientX, e.currentTarget)} onMouseLeave={() => setHover(null)} onTouchStart={e => pick(e.touches[0].clientX, e.currentTarget)} onTouchMove={e => pick(e.touches[0].clientX, e.currentTarget)} onClick={() => hover !== null && onYear?.(hover)}>
        {band && <rect x={x(band[0])} y={m.t} width={Math.max(2, x(band[1]) - x(band[0]))} height={height - m.b - m.t} fill="#cdd6bb" opacity={0.35} />}
        {y.ticks(5).map(t => <g key={t}><line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke={C.line} strokeWidth={t === 0 ? 1.2 : 0.7} /><text x={m.l - 7} y={y(t) + 4} textAnchor="end" className="axis-text">{t === 0 ? '0' : short(t)}</text></g>)}
        {x.ticks(width < 560 ? 5 : 8).map(t => <text key={t} x={x(t)} y={height - 9} textAnchor="middle" className="axis-text">{t}</text>)}
        <path d={area(rows) || ''} fill={series.colors[0]} opacity={0.16} />
        <path d={lineA(rows) || ''} fill="none" stroke={series.colors[0]} strokeWidth={2} />
        <path d={lineB(rows) || ''} fill="none" stroke={series.colors[1]} strokeWidth={2} strokeDasharray={mode === 'compare' ? undefined : '5 3'} />
        {marks.map(e => <g key={e.year + e.title} className="event-mark"><line x1={x(e.year)} x2={x(e.year)} y1={m.t - 8} y2={y(series.a(rows.find(r => r.year === e.year)!))} stroke={e.kind === 'crisis' ? '#8d3b28' : C.muted} strokeWidth={0.8} strokeDasharray="2 3" /><circle cx={x(e.year)} cy={m.t - 12} r={hover === e.year ? 5 : 3.5} fill={e.kind === 'crisis' ? '#8d3b28' : '#f8f5ec'} stroke={e.kind === 'crisis' ? '#8d3b28' : C.ink} strokeWidth={1.2} /></g>)}
        {row && <g pointerEvents="none"><line x1={x(row.year)} x2={x(row.year)} y1={m.t} y2={height - m.b} stroke={C.ink} strokeWidth={1} /><circle cx={x(row.year)} cy={y(series.a(row))} r={4.5} fill={series.colors[0]} stroke="#fff" strokeWidth={1.5} />{series.b(row) !== null && <circle cx={x(row.year)} cy={y(series.b(row)!)} r={4.5} fill={series.colors[1]} stroke="#fff" strokeWidth={1.5} />}</g>}
      </svg>
      {row && <div className="chart-tip" style={{left: tipLeft}}>
        <strong>{row.year}</strong>
        <span><i style={{background: series.colors[0]}} />{series.names[0]}: <b>{nf.format(series.a(row))}</b></span>
        <span><i style={{background: series.colors[1]}} />{series.names[1]}: <b>{series.b(row) === null ? 'sin dato anual' : nf.format(series.b(row)!)}</b></span>
        {mode === 'total' && row.net !== null && <span className={row.net < 0 ? 'negative' : ''}>Saldo: <b>{row.net > 0 ? '+' : ''}{nf.format(row.net)}</b></span>}
      </div>}
      <div className="chart-event" aria-live="polite">{(() => {
        const e = row && events.filter(v => v.year === row.year);
        return e && e.length ? e.map(v => <p key={v.title}><strong>{v.year} · {v.title}.</strong> {v.text}</p>) : <p className="hint">Pasá el cursor o deslizá el dedo sobre el gráfico. Los puntos de arriba marcan hitos y crisis.</p>;
      })()}</div>
    </div>
  );
}

/** Miniatura de la serie para la barra de épocas del atlas. */
export function EraSpark({rows, era}: {rows: SeriesRow[]; era: Era}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const h = 54, x = d3.scaleLinear().domain([1850, 1960]).range([0, width]);
  const y = d3.scaleLinear().domain([0, d3.max(rows, r => r.immigrants)!]).range([h - 2, 6]);
  const area = d3.area<SeriesRow>().x(r => x(r.year)).y0(h).y1(r => y(r.immigrants)).curve(d3.curveMonotoneX);
  return (
    <div className="era-spark" ref={ref} aria-hidden="true">
      <svg width={width} height={h}>
        <rect x={x(era.start)} width={x(era.end) - x(era.start)} y={0} height={h} fill="#cdd6bb" opacity={0.55} />
        <path d={area(rows) || ''} fill="#b8593c" opacity={0.3} /><path d={d3.line<SeriesRow>().x(r => x(r.year)).y(r => y(r.immigrants)).curve(d3.curveMonotoneX)(rows) || ''} fill="none" stroke="#b8593c" strokeWidth={1.4} />
        <line x1={x(1924)} x2={width} y1={h - 1} y2={h - 1} stroke="#9aa093" strokeDasharray="2 4" />
        {width > 520 && <text x={x(1942)} y={h - 8} textAnchor="middle" className="axis-text">sin serie anual homogénea</text>}
        <text x={x(1857) + 2} y={12} className="axis-text">Entradas por año</text>
      </svg>
    </div>
  );
}

export type BarRow = {label: string; value: number; second?: number; note?: string; color?: string};
/** Barras horizontales, con una segunda magnitud opcional superpuesta. */
export function HBars({rows, format = nf.format, secondLabel, max}: {rows: BarRow[]; format?: (v: number) => string; secondLabel?: string; max?: number}) {
  const top = max ?? Math.max(...rows.map(r => r.value));
  return (
    <div className="hbars">
      {rows.map(r => (
        <div className="hbar" key={r.label}>
          <span className="hbar-label">{r.label}</span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{width: `${Math.max(0.4, (r.value / top) * 100)}%`, background: r.color || C.arrivals}} />
            {r.second !== undefined && <div className="hbar-second" style={{width: `${Math.max(0.3, (r.second / top) * 100)}%`}} title={secondLabel} />}
          </div>
          <span className="hbar-value">{format(r.value)}{r.note && <small>{r.note}</small>}</span>
        </div>
      ))}
    </div>
  );
}
