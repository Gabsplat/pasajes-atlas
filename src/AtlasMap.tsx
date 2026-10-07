import React, {useEffect, useMemo, useRef, useState} from 'react';
import * as d3 from 'd3';
import {feature} from 'topojson-client';
import type {FeatureCollection, Geometry, GeoJsonProperties} from 'geojson';
import {Globe2, LocateFixed, Minus, Plus} from 'lucide-react';
import {nf} from './lib';
import {views, type Data, type Route, type View} from './types';

const W = 1150, H = 650;
const AREAS: Record<View, [number, number][]> = {Mundo: [], Atlántico: [[-94, -58], [48, 66]], Europa: [[-22, 32], [50, 63]], Argentina: [[-77, -55], [-49, -20]]};
const ALWAYS_LABELLED = ['ba', 'genoa', 'naples', 'vigo', 'madryn', 'ny', 'sydney', 'halifax', 'santos', 'bremen', 'cabopalos', 'ilhabela'];

type Tip = {x: number; y: number; title: string; sub?: string};
type Props = {
  data: Data; routes: Route[]; selected: string | null; onSelect: (id: string) => void;
  hovered: string | null; onHover: (id: string | null) => void;
  place: string | null; onPlace: (id: string | null) => void;
  view: View; setView: (v: View) => void; motion: boolean; destinations: boolean;
  /** Encadrar la selección. El recorrido guiado lo desactiva cuando fija su propia vista. */
  fit: boolean;
};

export function AtlasMap({data, routes, selected, onSelect, hovered, onHover, place, onPlace, view, setView, motion, destinations, fit}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [tr, setTr] = useState(d3.zoomIdentity);
  const [tip, setTip] = useState<Tip | null>(null);
  const countries = useMemo(() => feature(data.world, data.world.objects.countries) as unknown as FeatureCollection<Geometry, GeoJsonProperties>, [data.world]);
  const proj = useMemo(() => d3.geoNaturalEarth1().fitExtent([[18, 25], [W - 18, H - 25]], {type: 'Sphere'}), []);
  const path = useMemo(() => d3.geoPath(proj), [proj]);
  const land = useMemo(() => countries.features.map(c => ({id: c.id, name: c.properties?.name as string, d: path(c) || ''})), [countries, path]);
  const graticule = useMemo(() => path(d3.geoGraticule10()) || '', [path]);
  const coordsOf = (r: Route) => [data.places[r.origin].coordinates, ...r.via, data.places[r.destination].coordinates];
  const routePath = (r: Route) => path({type: 'LineString', coordinates: coordsOf(r)}) || '';

  // Margen en unidades del viewBox que ocupa el panel flotante, para no encuadrar debajo de él.
  const insets = () => {
    const el = svgRef.current!;
    const s = 1 / Math.max(el.clientWidth / W, el.clientHeight / H);
    const ox = (W - el.clientWidth * s) / 2, oy = (H - el.clientHeight * s) / 2;
    const wide = el.clientWidth > 900;
    return {left: ox + (wide ? 392 : 20) * s, right: ox + (wide ? 76 : 20) * s, top: oy + (wide ? 118 : 108) * s, bottom: oy + 64 * s};
  };
  const flyTo = (pts: [number, number][], maxK: number, ms = 650) => {
    if (!svgRef.current || !zoomRef.current || !pts.length) return;
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const m = insets();
    const k = Math.max(1, Math.min(maxK, (W - m.left - m.right) / Math.max(x1 - x0, 1), (H - m.top - m.bottom) / Math.max(y1 - y0, 1)));
    const cx = m.left + (W - m.left - m.right) / 2, cy = m.top + (H - m.top - m.bottom) / 2;
    const t = d3.zoomIdentity.translate(cx - k * (x0 + x1) / 2, cy - k * (y0 + y1) / 2).scale(k);
    const sel = d3.select(svgRef.current);
    (ms && !matchMedia('(prefers-reduced-motion: reduce)').matches ? sel.transition().duration(ms) : sel).call(zoomRef.current.transform as any, t);
  };

  useEffect(() => {
    if (!svgRef.current) return;
    const z = d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 24]).extent([[0, 0], [W, H]]).translateExtent([[-W, -H], [W * 2, H * 2]]).on('zoom', e => setTr(e.transform));
    zoomRef.current = z;
    const svg = d3.select(svgRef.current);
    svg.call(z);
    return () => { svg.on('.zoom', null); };
  }, []);
  const applyView = (ms = 0) => {
    if (view === 'Mundo') { if (svgRef.current && zoomRef.current) d3.select(svgRef.current).call(zoomRef.current.transform, d3.zoomIdentity); return; }
    flyTo(AREAS[view].map(x => proj(x)!) as [number, number][], 12, ms);
  };
  useEffect(() => { applyView(); }, [view, proj]);
  useEffect(() => {
    const r = routes.find(x => x.id === selected);
    if (r && fit) flyTo(coordsOf(r).map(c => proj(c)!) as [number, number][], 9);
  }, [selected, fit]);
  useEffect(() => {
    if (!place || !fit) return;
    const [x, y] = proj(data.places[place].coordinates)!;
    const span = 60 / Math.max(tr.k, 5);
    flyTo([[x - span, y - span], [x + span, y + span]], 14);
  }, [place]);

  const ids = (r: Route) => [r.origin, ...(r.stops || []), r.destination];
  const nodes = useMemo(() => [...new Set(routes.flatMap(ids))].map(id => data.places[id]), [routes, data.places]);
  const focus = routes.find(r => r.id === selected);
  const focusNodes = focus ? ids(focus) : [];
  const hoverNodes = hovered ? ids(routes.find(r => r.id === hovered) || ({origin: '', destination: ''} as Route)) : [];
  const k = tr.k;
  const showAllLabels = k >= 3.2;
  const maxForwarded = Math.max(...data.stats.interior.map(d => d.forwarded));
  const zoomBy = (f: number) => { if (svgRef.current && zoomRef.current) d3.select(svgRef.current).transition().duration(250).call(zoomRef.current.scaleBy, f); };
  const at = (e: React.MouseEvent, title: string, sub?: string) => {
    const b = wrapRef.current!.getBoundingClientRect();
    setTip({x: e.clientX - b.left, y: e.clientY - b.top, title, sub});
  };
  const count = (id: string) => routes.filter(r => ids(r).includes(id)).length;

  return (
    <div className="map-wrap" ref={wrapRef} onMouseLeave={() => setTip(null)}>
      <svg ref={svgRef} className="world-map" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mapa mundial interactivo de rutas migratorias. Arrastrá para mover y usá los botones para acercar.">
        <defs><pattern id="water" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".4" fill="#c6cdc3" opacity=".4" /></pattern></defs>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#eef0e8" /><rect x={-W} y={-H} width={W * 3} height={H * 3} fill="url(#water)" onClick={() => onPlace(null)} />
        <g transform={tr.toString()}>
          <path d={graticule} fill="none" stroke="#d0d6ca" strokeWidth={0.6 / k} />
          <g className="land" onMouseLeave={() => setTip(null)}>{land.map((c, i) => <path key={i} d={c.d} fill={c.id === '032' ? '#cdd6bb' : '#dfe2d2'} stroke="#f2f1e8" strokeWidth={0.65 / k} onClick={() => onPlace(null)} />)}</g>
          {!selected && view !== 'Argentina' && <text x={proj([-36, 9])![0]} y={proj([-36, 9])![1]} fontSize={13 / k} className="ocean-label" textAnchor="middle">O C É A N O   A T L Á N T I C O</text>}
          {destinations && <g className="destinations">{data.stats.interior.map(d => {
            const [x, y] = proj(d.coordinates)!;
            const r = Math.sqrt(d.forwarded / maxForwarded) * (5 + 5 * Math.min(k, 7)) / k;
            return <g key={d.name} onMouseMove={e => at(e, d.name, `${nf.format(d.forwarded)} trasladados por el Estado, 1894–1903 · ${nf.format(d.percent)} %`)} onMouseLeave={() => setTip(null)}>
              <circle cx={x} cy={y} r={Math.max(r, 1.6 / k)} className="destination-circle" strokeWidth={1 / k} />
              {k >= 4 && d.forwarded > 4000 && <text x={x} y={y + 3 / k} fontSize={9.5 / k} textAnchor="middle" className="destination-label">{nf.format(d.forwarded)}</text>}
            </g>;
          })}</g>}
          {routes.map(r => {
            const g = data.groups.find(x => x.id === r.group)!;
            const active = selected === r.id, hot = hovered === r.id;
            const muted = (!!selected && !active) || (!!hovered && !hot && !active);
            const d = routePath(r);
            const dash = r.layer === 'context' ? `${5 / k} ${4 / k}` : r.evidence === 'Corriente estacional' ? `${1.5 / k} ${3.5 / k}` : undefined;
            const documented = r.start === r.end;
            return <g key={r.id} className="map-route" opacity={muted ? (selected ? 0.12 : 0.3) : 1}>
              {(active || hot) && <path d={d} fill="none" stroke={g.color} strokeWidth={8 / k} strokeLinecap="round" opacity={0.18} />}
              <path id={`route-${r.id}`} d={d} fill="none" stroke={g.color} strokeWidth={(active ? 2.8 : hot ? 2.4 : documented ? 1.7 : 1.2) / k} strokeDasharray={dash} strokeLinecap="round" opacity={active || hot ? 1 : 0.72} />
              <path d={d} fill="none" stroke="transparent" strokeWidth={16 / k} className="route-hit" onClick={() => onSelect(r.id)}
                onMouseMove={e => { onHover(r.id); at(e, r.title, `${r.evidence} · ${r.start === r.end ? r.start : `${r.start}–${r.end}`}`); }} onMouseLeave={() => { onHover(null); setTip(null); }} />
              {motion && !muted && <circle r={(active ? 3.6 : 2) / k} fill={g.color} pointerEvents="none"><animateMotion dur={`${active ? 9 : 14 + (r.id.length % 8)}s`} repeatCount="indefinite" path={d} /></circle>}
            </g>;
          })}
          {nodes.map(p => {
            const chosen = focusNodes.includes(p.id) || place === p.id;
            const hot = hoverNodes.includes(p.id);
            const wreck = p.kind === 'Naufragio';
            const [x, y] = proj(p.coordinates)!;
            const label = chosen || hot || (!destinations && (showAllLabels || ALWAYS_LABELLED.includes(p.id)));
            return <g key={p.id} transform={`translate(${x},${y})`} className={`map-node ${chosen ? 'chosen' : ''}`} tabIndex={0} role="button" aria-label={`${p.name}, ${p.kind}`}
              onClick={() => onPlace(p.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPlace(p.id); } }}
              onMouseMove={e => at(e, p.name, `${p.kind} · ${count(p.id)} ${count(p.id) === 1 ? 'conexión' : 'conexiones'} en esta época`)} onMouseLeave={() => setTip(null)}>
              {place === p.id && <circle r={13 / k} className="node-pulse" strokeWidth={1.2 / k} />}
              {wreck
                ? <path d={`M${-4 / k},${-4 / k}L${4 / k},${4 / k}M${4 / k},${-4 / k}L${-4 / k},${4 / k}`} stroke="#8d3b28" strokeWidth={1.8 / k} strokeLinecap="round" />
                : <circle r={(chosen ? 6 : hot ? 5 : 3.8) / k} fill={chosen ? '#c35d3e' : '#fffdf6'} stroke={chosen ? '#fffdf6' : '#5e6659'} strokeWidth={1.4 / k} />}
              <circle r={13 / k} fill="transparent" />
              {label && <text x={9 / k} y={4 / k} fontSize={(chosen ? 12 : 10.5) / k} className="place-label pill" strokeWidth={4 / k}>{p.name}</text>}
            </g>;
          })}
        </g>
      </svg>
      {tip && <div className="map-tip" style={{left: Math.min(tip.x + 14, (wrapRef.current?.clientWidth || 600) - 250), top: tip.y + 16}}><strong>{tip.title}</strong>{tip.sub && <span>{tip.sub}</span>}</div>}
      <div className="map-dock">
        <div className="view-tabs">{views.map(v => <button key={v} className={view === v ? 'active' : ''} onClick={() => (view === v ? applyView(450) : setView(v))}>{v === 'Mundo' && <Globe2 size={13} />} {v}</button>)}</div>
      </div>
      <div className="map-tools">
        <button title="Acercar mapa" aria-label="Acercar mapa" onClick={() => zoomBy(1.6)}><Plus size={17} /></button>
        <button title="Alejar mapa" aria-label="Alejar mapa" onClick={() => zoomBy(1 / 1.6)}><Minus size={17} /></button>
        <button title="Volver a encuadrar" aria-label="Volver a encuadrar" onClick={() => { const r = routes.find(x => x.id === selected); if (r) flyTo(coordsOf(r).map(c => proj(c)!) as [number, number][], 9); else applyView(450); }}><LocateFixed size={16} /></button>
      </div>
      <div className="map-credit">Natural Earth · fronteras actuales · curvas esquemáticas</div>
    </div>
  );
}
