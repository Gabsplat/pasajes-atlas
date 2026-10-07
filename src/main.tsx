import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, Compass, Globe2, Link as LinkIcon, MapPin, Menu, Pause, Play, RotateCcw, Route as RouteIcon, Search, Ship, X} from 'lucide-react';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/libre-baskerville/400.css';
import '@fontsource/libre-baskerville/400-italic.css';
import './style.css';
import './extra.css';
import './atlas.css';
import {AtlasMap} from './AtlasMap';
import {EraSpark} from './Charts';
import {Chronology, Cifras, Research, SourcesPage} from './Pages';
import {Cite, fig, norm} from './lib';
import type {Data, Route, View} from './types';

const layerNames: Record<string, string> = {arrival: 'Llegadas', interior: 'Dentro de Argentina', return: 'Retornos', context: 'Otros destinos'};
const TABS: [string, string][] = [['atlas', 'El atlas'], ['cifras', 'Las cifras'], ['investigacion', 'La investigación'], ['cronologia', 'Cronología'], ['fuentes', 'Fuentes y archivo']];
const span = (r: Route) => (r.start === r.end ? `${r.start}` : `${r.start}–${r.end}`);
const dated = (r: Route) => r.start === r.end;

type Step = {route: string; era: string; view: View; title: string; text: string; destinations?: boolean};
const tourSteps: Step[] = [
  {route: 'genoa-ba', era: 'mass', view: 'Atlántico', title: '01. La corriente mayor', text: 'Entre 1857 y 1924 se anotaron 2,6 millones de entradas de italianos. La línea une dos puertos. La cifra pertenece al país entero, no a esta ruta.'},
  {route: 'golondrinas', era: 'mass', view: 'Atlántico', title: '02. El Atlántico tenía dos sentidos', text: 'Entre 50.000 y 70.000 trabajadores por temporada venían para la cosecha y volvían en otoño. Por cada cien entradas hubo cuarenta y siete salidas.'},
  {route: 'weser', era: 'mass', view: 'Atlántico', title: '03. Un barco con nombre', text: 'El Weser ancló el 14 de agosto de 1889 con familias judías de Podolia. Las tierras prometidas estaban ocupadas. De ese grupo nació Moisés Ville.'},
  {route: 'aveyron-pigue', era: 'mass', view: 'Atlántico', title: '04. Un pueblo que se muda', text: 'Cuarenta familias del Aveyron salieron de Rodez en octubre de 1884 y bajaron del tren en Pigüé en diciembre. La colonia fue un negocio privado.'},
  {route: 'ba-rosario', era: 'mass', view: 'Argentina', destinations: true, title: '05. Después del puerto', text: 'Los círculos muestran a dónde trasladó el Estado a 285.371 inmigrantes entre 1894 y 1903. Santa Fe y Buenos Aires reciben dos de cada tres.'},
  {route: 'sirio', era: 'mass', view: 'Europa', title: '06. El viaje que no llegó', text: 'El Sirio encalló en Cabo de Palos el 4 de agosto de 1906, dos días después de zarpar de Génova. Las fuentes cuentan entre 400 y 500 muertos.'},
  {route: 'mimosa', era: 'early', view: 'Atlántico', title: '07. Mineros en Patagonia', text: 'Unos 150 galeses llegaron a Golfo Nuevo en julio de 1865. Casi todos venían de valles industriales, no del campo.'},
  {route: 'massilia', era: 'refuge', view: 'Atlántico', title: '08. Salir no garantizaba entrar', text: 'Los republicanos españoles del Massilia llegaron en noviembre de 1939. Desde 1938 una circular secreta mandaba negar visas a los expulsados de su país.'},
  {route: 'london-sydney', era: 'postwar', view: 'Mundo', title: '09. Un sistema mundial', text: 'Después de 1945 Australia, Canadá y Venezuela compitieron con Argentina por los emigrantes europeos. Italia registró 346.153 salidas hacia el Plata en seis años.'}
];

function App({data}: {data: Data}) {
  const q0 = new URLSearchParams(location.search);
  const [tab, setTab] = useState(TABS.some(t => t[0] === q0.get('tab')) ? q0.get('tab')! : 'atlas');
  const [era, setEra] = useState(data.eras.some(x => x.id === q0.get('era')) ? q0.get('era')! : 'mass');
  const [group, setGroup] = useState(data.groups.some(x => x.id === q0.get('grupo')) ? q0.get('grupo')! : 'all');
  const [layers, setLayers] = useState<string[]>(['arrival', 'interior']);
  const [destinations, setDestinations] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [view, setView] = useState<View>('Atlántico');
  const [motion, setMotion] = useState(!matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState('');
  const [tour, setTour] = useState<number | null>(null);
  const [notice, setNotice] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [chapter, setChapter] = useState(data.chapters.some(c => c.id === q0.get('cap')) ? q0.get('cap')! : 'scale');

  const currentEra = data.eras.find(x => x.id === era)!;
  const groupOf = (id: string) => data.groups.find(g => g.id === id)!;
  const filtered = useMemo(() => data.routes.filter(r => r.start <= currentEra.end && r.end >= currentEra.start && (group === 'all' || r.group === group) && layers.includes(r.layer)
    && norm(`${r.title} ${r.description} ${groupOf(r.group).name} ${data.places[r.origin].name} ${data.places[r.destination].name}`).includes(norm(query))), [data, group, layers, currentEra, query]);
  const route = filtered.find(r => r.id === selected);
  const currentGroup = data.groups.find(g => g.id === group);
  const currentPlace = place ? data.places[place] : null;
  const touches = (r: Route, id: string) => r.origin === id || r.destination === id || !!r.stops?.includes(id);

  useEffect(() => { if (selected && !filtered.some(r => r.id === selected)) setSelected(null); }, [filtered, selected]);
  useEffect(() => {
    const p = new URLSearchParams({tab, era});
    if (group !== 'all') p.set('grupo', group);
    if (tab === 'investigacion') p.set('cap', chapter);
    // Cambiar de pestaña agrega una entrada al historial: habilita el botón Atrás y cuenta como vista en la analítica.
    const url = `${location.pathname}?${p}`;
    if (new URLSearchParams(location.search).get('tab') !== tab && location.search) history.pushState(null, '', url);
    else history.replaceState(null, '', url);
  }, [tab, era, group, chapter]);
  useEffect(() => {
    const back = () => { const t = new URLSearchParams(location.search).get('tab'); setTab(TABS.some(x => x[0] === t) ? t! : 'atlas'); };
    window.addEventListener('popstate', back);
    return () => window.removeEventListener('popstate', back);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setEra(old => { const i = data.eras.findIndex(e => e.id === old); if (i === data.eras.length - 1) { setPlaying(false); return old; } return data.eras[i + 1].id; }), 3600);
    return () => clearInterval(t);
  }, [playing, data.eras]);
  useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelected(null); setPlace(null); setTour(null); setMobileNav(false); return; }
      const el = e.target as HTMLElement;
      if (tab !== 'atlas' || /INPUT|SELECT|TEXTAREA/.test(el.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { if (!filtered.length) return; e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1); }
    };
    window.addEventListener('keydown', keys);
    return () => window.removeEventListener('keydown', keys);
  });
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(t); }, [notice]);

  const go = (id: string) => { setTab(id); setMobileNav(false); setPlaying(false); window.scrollTo({top: 0}); };
  const chooseRoute = (id: string) => { setSelected(id); setPlace(null); setPanelOpen(true); };
  const step = (d: number) => { if (!filtered.length) return; const i = filtered.findIndex(r => r.id === selected); chooseRoute(filtered[(i + d + filtered.length) % filtered.length].id); setTour(null); };
  const reset = () => { setGroup('all'); setQuery(''); setLayers(['arrival', 'interior']); setDestinations(false); setEra('mass'); setSelected(null); setPlace(null); setView('Atlántico'); setTour(null); setPlaying(false); };
  const openEra = (id: string) => { setEra(id); setSelected(null); setTour(null); go('atlas'); };
  const openChapter = (id: string) => { setChapter(id); go('investigacion'); };
  const showDestinations = () => { setEra('mass'); setGroup('all'); setQuery(''); setLayers(['interior']); setDestinations(true); setSelected(null); setPlace(null); setView('Argentina'); setTour(null); go('atlas'); };
  function doTour(i: number) {
    const step = tourSteps[i];
    setTab('atlas'); setTour(i); setEra(step.era); setGroup('all'); setQuery(''); setPlace(null);
    setLayers([data.routes.find(r => r.id === step.route)!.layer]); setDestinations(!!step.destinations);
    setSelected(step.route); setView(step.view); setPlaying(false);
  }
  async function share() {
    try { await navigator.clipboard.writeText(location.href); setNotice('Enlace copiado con tu época y comunidad'); }
    catch { setNotice('Podés copiar el enlace desde la barra del navegador'); }
  }
  const toggleLayer = (id: string) => { setLayers(old => (old.includes(id) ? old.filter(x => x !== id) : [...old, id])); setTour(null); };
  const placeRoutes = currentPlace ? data.routes.filter(r => touches(r, currentPlace.id)) : [];

  return <>
    <a className="skip" href="#main">Saltar al contenido</a>
    <header>
      <a className="brand" href="?tab=atlas&era=mass" aria-label="Pasajes, inicio"><Compass size={28} strokeWidth={1.4} /><span>pasajes<span className="brand-period">.</span></span></a>
      <div className="brand-descriptor">UN ATLAS DE LA<br />INMIGRACIÓN A ARGENTINA</div>
      <nav className={mobileNav ? 'open' : ''}>{TABS.map(([id, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => go(id)}>{label}</button>)}</nav>
      <button className="header-share" onClick={share} aria-label="Copiar enlace"><LinkIcon size={17} /><span>Compartir</span></button>
      <button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Menú de navegación"><Menu /></button>
    </header>
    <main id="main">
      {tab === 'atlas' && <>
        <section className="intro">
          <div>
            <div className="eyebrow"><span /> EUROPA → ARGENTINA <span className="eyebrow-line" /> 1850–1960</div>
            <h1>Un océano.<br /><em>Millones de cruces.</em></h1>
            <p>De dónde salieron, por dónde pasaron, a dónde fueron<br className="desktop-break" /> y cuántos volvieron. Con las cifras de los registros de la época.</p>
          </div>
          <div className="intro-side">
            <p>SERIE OFICIAL 1857–1924</p>
            <div className="intro-stat">5,48<span> M</span></div>
            <span>de entradas de ultramar y 2,56 millones de salidas.<br />En 1914, el 29,9 % de la población era extranjera.</span>
            <button className="text-button" onClick={() => go('cifras')}>Ver año por año <ArrowUpRight size={15} /></button>
          </div>
        </section>
        <section className="atlas-shell" aria-label="Explorador de rutas">
          <div className="atlas-toolbar">
            <div className="atlas-title"><Globe2 size={19} /><strong>Explorá las rutas</strong><span className="small-badge">{filtered.length} conexiones</span></div>
            <div>
              <button className={tour !== null ? 'tour-button active' : 'tour-button'} onClick={() => (tour === null ? doTour(0) : setTour(null))}><Play size={13} /> Recorrido guiado</button>
              <button className="icon-button" title="Restablecer filtros" aria-label="Restablecer filtros" onClick={reset}><RotateCcw size={15} /></button>
            </div>
          </div>
          <div className="stage">
            <AtlasMap data={data} routes={filtered} selected={selected} onSelect={chooseRoute} hovered={hovered} onHover={setHovered} place={place} onPlace={id => { setPlace(id); if (id) setSelected(null); }} view={view} setView={setView} motion={motion} destinations={destinations} fit={tour === null || !tourSteps[tour].destinations} />
            <div className="stage-bar">
              <div className="chip-row" role="group" aria-label="Época">
                {data.eras.map(e => <button key={e.id} className={`chip era-chip ${era === e.id ? 'on' : ''}`} title={e.title} onClick={() => { setEra(e.id); setPlaying(false); setTour(null); }}>{e.short}</button>)}
              </div>
              <div className="chip-row" role="group" aria-label="Capas del mapa">
                {Object.entries(layerNames).map(([id, name]) => <button key={id} className={`chip ${layers.includes(id) ? 'on' : ''}`} aria-pressed={layers.includes(id)} onClick={() => toggleLayer(id)}><span className={`layer-symbol ${id}`} />{name}</button>)}
                <button className={`chip ${destinations ? 'on' : ''}`} aria-pressed={destinations} title="Inmigrantes trasladados por el Estado a cada provincia" onClick={() => { setDestinations(!destinations); if (!destinations) setView('Argentina'); }}><span className="layer-symbol destinos" />Destinos 1894–1903</button>
                <button className={`chip ${motion ? 'on' : ''}`} aria-pressed={motion} onClick={() => setMotion(!motion)}>{motion ? <Pause size={11} /> : <Play size={11} />}Trazas</button>
              </div>
            </div>
            <aside className={`float-panel ${panelOpen ? '' : 'closed'} ${route || currentPlace ? 'has-detail' : ''}`} aria-label="Conexiones y fichas">
              <button className="panel-toggle" onClick={() => setPanelOpen(!panelOpen)} aria-label={panelOpen ? 'Ocultar panel' : 'Mostrar panel'} aria-expanded={panelOpen}>{panelOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}</button>
              <span className="sheet-grabber" aria-hidden="true" />
              {route && <div className="route-detail" aria-live="polite">
                <div className="detail-nav">
                  <button className="back-button" onClick={() => setSelected(null)}><ArrowLeft size={14} /> Conexiones</button>
                  <div><button aria-label="Conexión anterior" disabled={filtered.length < 2} onClick={() => step(-1)}><ChevronLeft size={16} /></button><span>{filtered.indexOf(route) + 1} / {filtered.length}</span><button aria-label="Conexión siguiente" disabled={filtered.length < 2} onClick={() => step(1)}><ChevronRight size={16} /></button><button className="icon-button" onClick={() => setSelected(null)} aria-label="Cerrar detalle de ruta"><X size={17} /></button></div>
                </div>
                <span className="eyebrow"><i style={{background: groupOf(route.group).color}} />{groupOf(route.group).name} · {route.evidence} · {span(route)}</span>
                <h2>{route.title}</h2>
                <div className="route-facts">
                  <button onClick={() => { setPlace(route.origin); setSelected(null); }}><MapPin size={15} /><span>Origen<br /><strong>{data.places[route.origin].name}</strong></span></button>
                  <ArrowRight size={16} />
                  <button onClick={() => { setPlace(route.destination); setSelected(null); }}><MapPin size={15} /><span>{data.places[route.destination].kind === 'Naufragio' ? 'Fin del viaje' : 'Destino'}<br /><strong>{data.places[route.destination].name}</strong></span></button>
                </div>
                <p>{route.description}</p>
                {route.stops?.length && <p className="stop-list"><strong>{route.id === 'ireland-ba' ? 'Puertos de embarque documentados:' : 'Escalas documentadas:'}</strong> {route.stops.map(id => data.places[id].name).join(' → ')}</p>}
                <Cite data={data} ids={route.sources} />
                <details><summary>Cómo interpretar esta conexión <ChevronDown size={13} /></summary><p>{route.geometryNote} {route.dateNote}</p></details>
              </div>}
              {currentPlace && !route && <div className="route-detail place-detail" aria-live="polite">
                <div className="detail-nav"><button className="back-button" onClick={() => setPlace(null)}><ArrowLeft size={14} /> Conexiones</button><div><button className="icon-button" onClick={() => setPlace(null)} aria-label="Cerrar ficha del lugar"><X size={17} /></button></div></div>
                <span className="eyebrow">{currentPlace.kind} · {Math.abs(currentPlace.coordinates[1]).toFixed(1)}° {currentPlace.coordinates[1] < 0 ? 'S' : 'N'}, {Math.abs(currentPlace.coordinates[0]).toFixed(1)}° {currentPlace.coordinates[0] < 0 ? 'O' : 'E'}</span>
                <h2>{currentPlace.name}</h2>
                {currentPlace.note && <p>{currentPlace.note}</p>}
                <div className="place-routes"><span className="field-label">CONEXIONES DE ESTE LUGAR EN TODAS LAS ÉPOCAS</span>
                  {placeRoutes.map(r => { const e = data.eras.find(x => r.start <= x.end && r.end >= x.start)!; return <button key={r.id} onMouseEnter={() => setHovered(r.id)} onMouseLeave={() => setHovered(null)} onClick={() => { if (!filtered.some(f => f.id === r.id)) { setEra(e.id); setGroup('all'); setQuery(''); setLayers(old => (old.includes(r.layer) ? old : [...old, r.layer])); } chooseRoute(r.id); }}><i style={{background: groupOf(r.group).color}} />{r.title}<small>{span(r)}</small></button>; })}
                </div>
              </div>}
              {!route && !currentPlace && <div className="panel-list">
                <div className="search-wrap"><Search size={14} /><input aria-label="Buscar rutas" placeholder="Puerto, colonia, barco…" value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label="Limpiar búsqueda" onClick={() => setQuery('')}><X size={12} /></button>}</div>
                <div className="select-wrap"><select id="community" aria-label="Comunidad o corriente" value={group} onChange={e => { setGroup(e.target.value); setTour(null); }}><option value="all">Todas las comunidades</option>{data.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select><ChevronDown size={14} /></div>
                {currentGroup && <div className="community-note"><strong style={{color: currentGroup.color}}>{currentGroup.summary}</strong><p>{currentGroup.detail}</p><Cite data={data} ids={currentGroup.sources} /></div>}
                <div className="route-list-label">{filtered.length} CONEXIONES · {currentEra.short}</div>
                <div className="route-list">
                  {filtered.map(r => <button key={r.id} className={`route-row ${hovered === r.id ? 'hot' : ''}`} onClick={() => chooseRoute(r.id)} onMouseEnter={() => setHovered(r.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(r.id)} onBlur={() => setHovered(null)}>
                    <i style={{background: groupOf(r.group).color}} />
                    <div><strong>{data.places[r.origin].name}</strong><span>→ {data.places[r.destination].name}</span><small>{dated(r) ? `${r.start} · ${r.evidence}` : r.evidence === 'Corriente estacional' ? 'Corriente estacional' : layerNames[r.layer]}</small></div>
                    {dated(r) ? <Ship size={14} /> : <ChevronRight size={14} />}
                  </button>)}
                  {!filtered.length && <div className="empty"><RouteIcon /><strong>No hay conexiones para estos filtros.</strong><p>Probá otra época o activá más capas.</p><button className="text-button" onClick={reset}>Restablecer filtros <ArrowRight size={14} /></button></div>}
                </div>
              </div>}
            </aside>
            {tour !== null && <div className="tour-card">
              <div><span className="eyebrow">RECORRIDO GUIADO · {tour + 1} / {tourSteps.length}</span><h3>{tourSteps[tour].title}</h3><p>{tourSteps[tour].text}</p></div>
              <div className="tour-controls"><button disabled={tour === 0} onClick={() => doTour(tour - 1)} aria-label="Paso anterior"><ArrowLeft size={17} /></button><button onClick={() => (tour === tourSteps.length - 1 ? setTour(null) : doTour(tour + 1))}>{tour === tourSteps.length - 1 ? 'Terminar' : 'Siguiente'}<ArrowRight size={17} /></button></div>
            </div>}
          </div>
          <div className="map-legend">
            <div>
              {data.groups.filter(g => filtered.some(r => r.group === g.id)).map(g => <button key={g.id} className={group === g.id ? 'on' : ''} onClick={() => { setGroup(group === g.id ? 'all' : g.id); setTour(null); }} title={`Filtrar: ${g.name}`}><i style={{background: g.color}} />{g.name}</button>)}
              {destinations && <span><i className="legend-destination" />Trasladados por el Estado, 1894–1903</span>}
            </div>
            <span className="legend-hint"><kbd>←</kbd><kbd>→</kbd> recorrer · <kbd>Esc</kbd> cerrar</span>
          </div>
          <div className="timeline">
            <div className="timeline-heading">
              <button className="timeline-play" aria-label={playing ? 'Pausar cronología' : 'Reproducir cronología'} onClick={() => { setTour(null); if (!playing && era === 'postwar') setEra('early'); setPlaying(!playing); }}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
              <div><span className="eyebrow">CAMBIÁ DE ÉPOCA</span><strong>{currentEra.title}</strong></div>
              <span className="timeline-range">{currentEra.short}</span>
            </div>
            <EraSpark rows={data.stats.series} era={currentEra} />
            <div className="era-track">{data.eras.map(e => <button className={era === e.id ? 'active' : ''} key={e.id} onClick={() => { setEra(e.id); setPlaying(false); setTour(null); }}><span className="era-dot" /><strong>{e.short}</strong><span>{e.title}</span></button>)}</div>
            <div className="era-context"><p>{currentEra.description}</p><div>{currentEra.events.map(e => <span key={e}>{e}</span>)}</div></div>
            <div className="era-figures">
              {currentEra.figures.map(f => <div key={f.label}><strong>{fig(f.value)}</strong><span>{f.label}</span></div>)}
              <p>{currentEra.figuresNote}</p>
            </div>
          </div>
        </section>
        <div className="map-caption"><span><strong>Una lectura histórica, no un registro de navegación.</strong> Curvas esquemáticas, sin volúmenes por ruta. Las cifras son nacionales y llevan su fuente.</span><button className="text-button" onClick={() => openChapter('methods')}>Ver metodología <ArrowUpRight size={14} /></button></div>
        <section className="below-grid">
          <div className="section-heading"><span className="eyebrow">SEGUIR EXPLORANDO</span><h2>El viaje no terminó<br />en el puerto.</h2><p>Veintiséis capítulos con cifras, casos y debates. Tres puertas de entrada.</p></div>
          {([['series', '01', 'La curva de las llegadas', 'Dos auges, dos derrumbes y un 1914 que empezó antes de la guerra.', <BarChart3 />], ['cases', '02', 'Ocho colonias, ocho contratos', 'De Esperanza a Tres Arroyos. Casi ningún acuerdo se cumplió como estaba escrito.', <MapPin />], ['myths', '03', 'Ocho afirmaciones, revisadas', '«Vinieron a quedarse», «eran campesinos» y otras frases frente a las fuentes.', <BookOpen />]] as [string, string, string, string, React.ReactNode][]).map(([id, n, title, desc, icon]) =>
            <button className="editorial-card" key={id} onClick={() => openChapter(id)}><span>{n} / CUADERNO DE INVESTIGACIÓN</span><div className="card-symbol">{icon}</div><h3>{title}</h3><p>{desc}</p><ArrowUpRight size={20} /></button>)}
        </section>
      </>}
      {tab === 'cifras' && <Cifras data={data} onEra={openEra} onDestinations={showDestinations} />}
      {tab === 'investigacion' && <Research data={data} chapter={chapter} setChapter={setChapter} />}
      {tab === 'cronologia' && <Chronology data={data} onEra={openEra} />}
      {tab === 'fuentes' && <SourcesPage data={data} />}
    </main>
    <footer><a className="brand" href="?tab=atlas&era=mass"><Compass size={23} /><span>pasajes.</span></a><p>Un atlas para mirar de cerca una historia compartida.</p><span>SEGUNDA EDICIÓN · OCTUBRE 2026 · <a href="https://github.com/Gabsplat/pasajes-atlas" target="_blank" rel="noreferrer">CÓDIGO Y DATOS EN GITHUB</a> · HECHO CON CLAUDE OPUS 5.5</span></footer>
    {notice && <div className="toast" role="status"><Check size={17} />{notice}</div>}
  </>;
}

// Cloudflare Web Analytics: sin cookies. Solo en el sitio publicado, para no contar la vista previa ni el desarrollo local.
if (location.hostname === 'pasajes-atlas.gaabgames.workers.dev') {
  const s = document.createElement('script');
  s.type = 'module';
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.dataset.cfBeacon = JSON.stringify({token: 'df41090a44d84bc483db15aa17d188bc'});
  document.head.appendChild(s);
}

const files = ['sources', 'eras', 'groups', 'places', 'routes', 'chapters', 'census', 'stats', 'timeline', 'world'] as const;
const root = createRoot(document.getElementById('root')!);
Promise.all(files.map(async name => { const r = await fetch(`/data/${name}.json`); if (!r.ok) throw new Error(`No se pudo cargar ${name}`); return [name, await r.json()]; }))
  .then(entries => root.render(<App data={Object.fromEntries(entries) as Data} />))
  .catch(() => root.render(<div className="load-error"><h1>No pudimos abrir el atlas.</h1><p>Revisá la conexión con la vista previa y volvé a intentar.</p><button onClick={() => location.reload()}>Reintentar</button></div>));
