import React, {useState} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, Download, FileText, MapPin, Search} from 'lucide-react';
import {Cite, csv, download, fig, nf, norm, pct} from './lib';
import {HBars, SeriesChart, type SeriesMode} from './Charts';
import type {Data} from './types';

const CSV = 'text/csv;charset=utf-8';

export function Cifras({data, onEra, onDestinations, onChapter}: {data: Data; onEra: (id: string) => void; onDestinations: () => void; onChapter: (id: string) => void}) {
  const st = data.stats;
  const [mode, setMode] = useState<SeriesMode>('total');
  const [metric, setMetric] = useState<'percent' | 'foreign'>('percent');
  const [sort, setSort] = useState<'immigrants' | 'ratio'>('immigrants');
  const url = (id: string) => data.sources.find(s => s.id === id)!.url;
  const eraOf = (y: number) => data.eras.find(e => y >= e.start && y <= e.end)?.id || 'mass';
  const nat = [...st.nationalities].filter(n => sort === 'immigrants' || n.immigrants > 8000).sort((a, b) => b[sort] - a[sort]);
  const modes: [SeriesMode, string][] = [['total', 'Total'], ['italian', 'Italianos'], ['spanish', 'Españoles'], ['compare', 'Italia y España']];
  return (
    <section className="content-page">
      <div className="eyebrow">LEER LOS NÚMEROS</div>
      <h1>Una transformación<br /><em>a escala de un país.</em></h1>
      <p className="page-lead">Los puertos registran cruces. Los censos cuentan residentes.<br />Ninguno de los dos cuenta descendientes.</p>
      <div className="stat-grid four">
        <article><span>ENTRADAS · 1857–1924</span><strong>5,48 <small>millones</small></strong><p>Pasajeros extranjeros de segunda y tercera clase llegados por mar. Quien cruzó dos veces cuenta dos veces.</p></article>
        <article><span>SALIDAS · 1857–1924</span><strong>2,56 <small>millones</small></strong><p>El 47 % de las entradas. Incluye retornos, reemigración y trabajadores de temporada.</p></article>
        <article><span>SALDO · 1857–1924</span><strong>2,92 <small>millones</small></strong><p>Entradas menos salidas. No descuenta muertes ni suma hijos nacidos en el país.</p></article>
        <article><span>EXTRANJEROS · CENSO 1914</span><strong>29,9<small>%</small></strong><p>2.357.952 residentes de todos los orígenes. El 91,4 % no venía de un país limítrofe.</p></article>
      </div>
      <Cite data={data} ids={['willcox', 'census', 'modolo']} />

      <div className="chart-card">
        <div className="chart-header">
          <div><span className="eyebrow">SERIE ANUAL · 1857–1924</span><h2>Entradas y salidas, año por año</h2></div>
          <div className="segmented" role="group" aria-label="Serie a mostrar">{modes.map(([id, label]) => <button key={id} className={mode === id ? 'active' : ''} onClick={() => setMode(id)}>{label}</button>)}</div>
        </div>
        <SeriesChart rows={st.series} events={data.timeline} mode={mode} onYear={y => onEra(eraOf(y))} />
        <p className="chart-note">{st.seriesNote}</p>
        <div className="chart-actions">
          <button className="outline-button" onClick={() => download('pasajes-serie-anual-1857-1924.csv', csv(['año', 'entradas', 'salidas', 'saldo', 'italianos_entradas', 'italianos_salidas', 'españoles_entradas', 'españoles_salidas', 'fuente'], st.series.map(r => [r.year, r.immigrants, r.emigrants, r.net, r.italianIn, r.italianOut, r.spanishIn, r.spanishOut, url('willcox')])), CSV)}><Download size={15} /> Descargar serie anual CSV</button>
          <Cite data={data} ids={['willcox', 'bunge']} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div><span className="eyebrow">POR DÉCADA · EN MILES</span><h2>Cuántos llegaban, cuántos se iban</h2></div></div>
        <div className="table-scroll"><table className="decades"><thead><tr><th>Período</th><th>Entradas</th><th>Salidas</th><th>Saldo</th><th>Varones</th><th>Alojados por el Estado</th><th aria-label="Saldo en barras" /></tr></thead>
          <tbody>{st.decades.map(d => <tr key={d.period}><td>{d.period}</td><td>{nf.format(d.immigrants)}</td><td>{nf.format(d.emigrants)}</td><td><b>{nf.format(d.balance)}</b></td><td>{pct(d.malePercent)}</td><td>{d.hotelPercent === null ? 's/d' : pct(d.hotelPercent)}</td><td className="cell-bar"><i style={{width: `${(d.balance / 1120) * 100}%`}} /></td></tr>)}</tbody></table></div>
        <p className="chart-note">Tablas 50, 53 y 55 de Bunge y García Mata. «Alojados por el Estado» son quienes usaron el Hotel de Inmigrantes y los beneficios de la Ley 817. La fuente no da el dato de 1911–1920.</p>
        <Cite data={data} ids={['bunge']} />
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div><span className="eyebrow">NACIONALIDADES · 1857–1924</span><h2>De dónde venían y cuántos se iban</h2></div>
          <div className="segmented"><button className={sort === 'immigrants' ? 'active' : ''} onClick={() => setSort('immigrants')}>Por entradas</button><button className={sort === 'ratio' ? 'active' : ''} onClick={() => setSort('ratio')}>Por salidas / entradas</button></div>
        </div>
        <div className="chart-legend"><span><i style={{background: '#b8593c'}} />{sort === 'immigrants' ? 'Entradas' : 'Salidas por cada 100 entradas'}</span>{sort === 'immigrants' && <span><i className="hatch" />Salidas</span>}</div>
        {sort === 'immigrants'
          ? <HBars rows={nat.map(n => ({label: n.name, value: n.immigrants, second: n.emigrants, note: ` · ${pct(n.ratio)} de salidas`, color: data.groups.find(g => g.id === n.group)?.color}))} secondLabel="Salidas" />
          : <HBars rows={nat.map(n => ({label: n.name, value: n.ratio, note: ` · ${nf.format(n.immigrants)} entradas`, color: data.groups.find(g => g.id === n.group)?.color}))} format={pct} max={100} />}
        <p className="chart-note">{st.nationalitiesNote}</p>
        <div className="chart-actions">
          <button className="outline-button" onClick={() => download('pasajes-nacionalidades-1857-1924.csv', csv(['nacionalidad', 'entradas', 'salidas', 'saldo', 'salidas_por_100_entradas', 'fuente'], st.nationalities.map(n => [n.name, n.immigrants, n.emigrants, n.net, n.ratio, url('willcox')])), CSV)}><Download size={15} /> Descargar nacionalidades CSV</button>
          <Cite data={data} ids={['willcox']} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div><span className="eyebrow">MEDIO ORIENTE · 1871–1924</span><h2>Los llamados «turcos»</h2></div><button className="outline-button" onClick={() => onChapter('levant')}>Leer el capítulo <ArrowUpRight size={15} /></button></div>
        <div className="chart-legend"><span><i style={{background: '#a3742f'}} />Entradas de «otomanos»</span><span><i className="hatch" />Salidas (desde 1891)</span></div>
        <HBars rows={st.ottoman.map(o => ({label: o.period, value: o.immigrants, second: o.emigrants ?? undefined, color: '#a3742f'}))} secondLabel="Salidas" />
        <p className="chart-note">{st.ottomanNote}</p>
        <div className="mini-grid">{st.ottomanFacts.map(f => <article key={f.label}><strong>{f.value}</strong><p>{f.label}</p></article>)}</div>
        <Cite data={data} ids={['willcox', 'jozami', 'bryce', 'boulgourdjian']} />
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div><span className="eyebrow">CINCO FOTOGRAFÍAS CENSALES</span><h2>La población extranjera</h2></div>
          <div className="segmented"><button className={metric === 'percent' ? 'active' : ''} onClick={() => setMetric('percent')}>Porcentaje</button><button className={metric === 'foreign' ? 'active' : ''} onClick={() => setMetric('foreign')}>Personas</button></div>
        </div>
        <div className="bar-chart five">{st.census.map(c => (
          <button className="bar-column" key={c.year} onClick={() => onEra(eraOf(Math.min(c.year, 1960)))} title={`Ver la época del censo de ${c.year}`}>
            <strong>{metric === 'percent' ? pct(c.percent) : nf.format(c.foreign)}</strong>
            <div className="bar-area"><div className="bar-fill" style={{height: `${metric === 'percent' ? (c.percent / 35) * 100 : (c.foreign / 2800000) * 100}%`}}><span>{metric === 'percent' ? (c.year === 1914 ? 'Máximo relativo' : '') : c.year === 1960 ? 'Máximo absoluto' : ''}</span></div></div>
            <b>{c.year}</b><span>{nf.format(c.total)} habitantes</span>
          </button>))}</div>
        <p className="chart-note">Puntos censales observados, sin interpolación. Tocá una barra para explorar su época en el atlas.</p>
        <div className="table-scroll"><table className="census-table"><thead><tr><th>Censo</th><th>Población total</th><th>Extranjeros</th><th>Proporción</th><th>No limítrofes</th><th>Población urbana</th></tr></thead>
          <tbody>{st.census.map(c => <tr key={c.year}><td>{c.year}</td><td>{nf.format(c.total)}</td><td>{nf.format(c.foreign)}</td><td>{pct(c.percent)}</td><td>{pct(c.nonBorder!)}</td><td>{c.urban ? pct(c.urban) : 's/d'}</td></tr>)}</tbody></table></div>
        <p className="chart-note">{st.censusNote}</p>
        <div className="mini-grid">{st.facts1914.map(f => <article key={f.label}><strong>{f.value}</strong><p>{f.label}</p></article>)}</div>
        <p className="chart-note">Cuatro datos del censo de 1914 citados por Bunge y García Mata.</p>
        <h3 className="sub-heading">La misma medida en otros países de inmigración</h3>
        <HBars rows={st.comparison.map(c => ({label: `${c.country}, ${c.year}`, value: c.percent, color: c.country === 'Argentina' ? '#b8593c' : '#8c9a86'}))} format={pct} max={35} />
        <p className="chart-note">{st.comparisonNote}</p>
        <div className="chart-actions">
          <button className="outline-button" onClick={() => download('censos-pasajes.csv', csv(['año', 'poblacion_total', 'extranjeros', 'porcentaje', 'no_limitrofes_porcentaje', 'urbana_porcentaje', 'fuente'], st.census.map(c => [c.year, c.total, c.foreign, c.percent, c.nonBorder ?? null, c.urban ?? null, url(c.year === 1960 ? 'modolo' : 'census')])), CSV)}><Download size={15} /> Descargar tabla CSV</button>
          <Cite data={data} ids={['census', 'modolo', 'bunge']} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div><span className="eyebrow">DESTINOS · 1894–1903</span><h2>A qué provincia los mandó el Estado</h2></div><button className="outline-button" onClick={onDestinations}><MapPin size={15} /> Ver en el mapa</button></div>
        <HBars rows={st.interior.map(d => ({label: d.name, value: d.forwarded, note: ` · ${pct(d.percent)}`}))} />
        <p className="chart-note">{st.interiorNote}</p>
        <div className="chart-actions">
          <button className="outline-button" onClick={() => download('pasajes-destinos-1894-1903.csv', csv(['jurisdiccion', 'inmigrantes_trasladados', 'porcentaje', 'longitud_referencia', 'latitud_referencia', 'fuente'], st.interior.map(d => [d.name, d.forwarded, d.percent, d.coordinates[0], d.coordinates[1], url('stlouis')])), CSV)}><Download size={15} /> Descargar destinos CSV</button>
          <Cite data={data} ids={['stlouis', 'bunge']} />
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header"><div><span className="eyebrow">OFICIOS DECLARADOS · 1894–1903</span><h2>Qué decían ser al desembarcar</h2></div></div>
        <HBars rows={st.trades.map(t => ({label: t.name, value: t.value, note: ` · ${pct(Math.round((t.value / st.tradesTotal) * 1000) / 10)}`, color: '#8c9a86'}))} />
        <p className="chart-note">{st.tradesNote} Se muestran las 16 categorías más numerosas de un total de {nf.format(st.tradesTotal)} personas.</p>
        <Cite data={data} ids={['stlouis']} />
      </div>

      <div className="two-cards">
        <div className="chart-card"><span className="eyebrow">REFUGIO JUDÍO</span><h2>Admitidos y clandestinos</h2><div className="period-list">{st.refuge.map(p => <div key={p.label}><span>{p.period}</span><strong>{nf.format(p.value)}</strong><p>{p.label}</p></div>)}</div><Cite data={data} ids={['ushmm']} /></div>
        <div className="chart-card"><span className="eyebrow">SEGUNDA POSGUERRA</span><h2>La última corriente italiana</h2><div className="period-list">{st.postwar.map(p => <div key={p.label}><span>{p.period}</span><strong>{nf.format(p.value)}</strong><p>{p.label}</p></div>)}</div><Cite data={data} ids={['scarzanella']} /></div>
      </div>

      <div className="explain-grid">{[
        ['Flujo', 'Entradas o salidas a lo largo de un período. Una persona puede producir varios movimientos.'],
        ['Saldo', 'La diferencia entre entradas y salidas. No cuenta las muertes posteriores ni los hijos nacidos aquí.'],
        ['Stock', 'Personas que residen en un lugar en una fecha. Es la medida de una fotografía censal.'],
        ['Ascendencia', 'Relaciones genealógicas que se superponen. Ningún censo argentino de este período la midió.']].map(([h, p]) => <article key={h}><h3>{h}</h3><p>{p}</p></article>)}</div>
    </section>
  );
}

export function Research({data, chapter, setChapter}: {data: Data; chapter: string; setChapter: (id: string) => void}) {
  const [q, setQ] = useState('');
  const idx = Math.max(0, data.chapters.findIndex(c => c.id === chapter));
  const ch = data.chapters[idx];
  const visible = data.chapters.filter(c => norm(`${c.title} ${c.lead} ${c.paragraphs.join(' ')} ${c.debate || ''}`).includes(norm(q)));
  const go = (id: string) => { setChapter(id); document.querySelector('.article-body')?.scrollIntoView({block: 'start', behavior: 'smooth'}); };
  const words = data.chapters.reduce((n, c) => n + c.paragraphs.join(' ').split(/\s+/).length, 0);
  return (
    <section className="content-page research-page">
      <div className="research-heading">
        <div><div className="eyebrow">CUADERNO DE INVESTIGACIÓN · {data.chapters.length} CAPÍTULOS · {nf.format(Math.round(words / 100) * 100)} PALABRAS</div><h1>Más allá<br /><em>de los barcos.</em></h1><p className="page-lead">Cifras de fuente primaria, casos documentados y debates abiertos.<br />Cada capítulo lleva a sus fuentes.</p></div>
        <a className="outline-button" href="/investigacion.md" download><Download size={16} /> Descargar investigación</a>
      </div>
      <div className="research-layout">
        <aside className="chapter-nav">
          <div className="search-wrap"><Search size={15} /><input placeholder="Buscar en la investigación…" aria-label="Buscar en la investigación" value={q} onChange={e => setQ(e.target.value)} /></div>
          {visible.map(c => <button key={c.id} className={c.id === ch.id ? 'active' : ''} onClick={() => go(c.id)}><span>{c.kicker.split(' / ')[0]}</span>{c.title}<ChevronRight size={14} /></button>)}
          {!visible.length && <p>No hay capítulos para esa búsqueda.</p>}
        </aside>
        <article className="article-body">
          <div className="eyebrow">{ch.kicker}</div>
          <h2>{ch.title}</h2>
          <p className="article-lead">{ch.lead}</p>
          {ch.facts && <div className="fact-grid">{ch.facts.map(f => <div key={f.label}><strong>{fig(f.value)}</strong><span>{f.label}</span></div>)}</div>}
          {ch.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          {ch.debate && <aside className="debate"><span className="eyebrow">EN DISCUSIÓN</span><p>{ch.debate}</p></aside>}
          <div className="article-sources"><span className="eyebrow">FUENTES DE ESTE CAPÍTULO</span>{ch.sources.map(id => { const s = data.sources.find(x => x.id === id)!; return <a key={id} href={s.url} target="_blank" rel="noreferrer"><div><small>{s.kind}</small><strong>{s.title}</strong><span>{s.author}</span></div><ArrowUpRight size={19} /></a>; })}</div>
          <div className="article-pagination">
            <button disabled={idx === 0} onClick={() => go(data.chapters[idx - 1].id)}><ArrowLeft size={16} /> Anterior</button>
            <span>{idx + 1} / {data.chapters.length}</span>
            <button disabled={idx === data.chapters.length - 1} onClick={() => go(data.chapters[idx + 1].id)}>Siguiente <ArrowRight size={16} /></button>
          </div>
        </article>
      </div>
    </section>
  );
}

export function Chronology({data, onEra}: {data: Data; onEra: (id: string) => void}) {
  const kinds = ['Todos', ...new Set(data.timeline.map(e => e.kind))];
  const [kind, setKind] = useState('Todos');
  const rows = data.timeline.filter(e => kind === 'Todos' || e.kind === kind);
  const byYear = Object.fromEntries(data.stats.series.map(r => [r.year, r]));
  return (
    <section className="content-page">
      <div className="eyebrow">CRONOLOGÍA · 1853–1960</div>
      <h1>Un siglo<br /><em>en {data.timeline.length} fechas.</em></h1>
      <p className="page-lead">Leyes, colonias, viajes, crisis y censos.<br />Cada hito muestra las llegadas de ese año cuando la serie las registra.</p>
      <div className="kind-filter" role="group" aria-label="Tipo de hito">{kinds.map(k => <button key={k} className={kind === k ? 'active' : ''} onClick={() => setKind(k)}>{k}</button>)}</div>
      <ol className="chronology">{rows.map(e => {
        const era = data.eras.find(x => e.year >= x.start && e.year <= x.end);
        const s = byYear[e.year];
        return <li key={e.year + e.title} className={`kind-${e.kind}`}>
          <div className="chrono-year"><strong>{e.year}</strong><span>{e.kind}</span></div>
          <div className="chrono-body">
            <h3>{e.title}</h3><p>{e.text}</p>
            {s && <p className="chrono-series">{nf.format(s.immigrants)} entradas de ultramar{s.emigrants !== null ? ` y ${nf.format(s.emigrants)} salidas` : ''} ese año.</p>}
            <div className="chrono-foot"><Cite data={data} ids={e.sources} />{era && <button className="text-button" onClick={() => onEra(era.id)}>Ver {era.short} en el atlas <ArrowUpRight size={14} /></button>}</div>
          </div>
        </li>;
      })}</ol>
    </section>
  );
}

export function SourcesPage({data}: {data: Data}) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('Todas');
  const visible = data.sources.filter(s => (kind === 'Todas' || s.kind === kind) && norm(`${s.title} ${s.author} ${s.note}`).includes(norm(q)));
  const corpus = () => download('pasajes-corpus.json', JSON.stringify({metadata: {title: 'Pasajes', edition: 'Segunda edición', date: '2026-10-07', scope: 'Inmigración europea a Argentina, 1850–1960', geometry: 'Esquemática; fronteras contemporáneas; sin volúmenes por ruta', series: data.stats.seriesNote}, sources: data.sources, routes: data.routes, places: data.places, groups: data.groups, eras: data.eras, timeline: data.timeline, stats: data.stats, chapters: data.chapters}, null, 2));
  return (
    <section className="content-page">
      <div className="eyebrow">LA EVIDENCIA DETRÁS DEL ATLAS</div>
      <h1>Volver<br /><em>a las fuentes.</em></h1>
      <p className="page-lead">{data.sources.length} referencias para comprobar, discutir y seguir investigando.<br />Estadística histórica, documentos, estudios, archivos, prensa y bibliografía.</p>
      <div className="source-banner"><FileText size={25} /><div><strong>Una investigación que podés llevarte.</strong><p>Series anuales, nacionalidades, destinos, rutas, cronología y capítulos en formatos abiertos. Las rutas no contienen volúmenes inventados.</p></div><button className="outline-button" onClick={corpus}><Download size={16} /> Descargar corpus</button></div>
      <div className="sources-filters">
        <div className="search-wrap"><Search size={16} /><input aria-label="Buscar fuentes" value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por autor, tema o institución…" /></div>
        <select aria-label="Tipo de fuente" value={kind} onChange={e => setKind(e.target.value)}>{['Todas', ...new Set(data.sources.map(s => s.kind))].map(k => <option key={k}>{k}</option>)}</select>
        <span>{visible.length} referencias</span>
      </div>
      <div className="sources-list">
        {visible.map(s => <article key={s.id}><span className="source-number">{(data.sources.indexOf(s) + 1).toString().padStart(2, '0')}</span><div><span className="source-type">{s.kind}</span><h3><a href={s.url} target="_blank" rel="noreferrer">{s.title} <ArrowUpRight size={16} /></a></h3><p>{s.author}</p>{s.note && <small>{s.note}</small>}</div></article>)}
        {!visible.length && <div className="empty"><Search /><strong>No encontramos referencias con esos filtros.</strong><button onClick={() => { setQ(''); setKind('Todas'); }}>Limpiar filtros</button></div>}
      </div>
      <div className="method-box">
        <h2>Cómo está construido este atlas</h2>
        <p>Las series anuales de 1857 a 1924 se transcribieron de las tablas oficiales reproducidas por Ferenczi y Willcox en 1929. Cada página se leyó dos veces por reconocimiento óptico y las sumas se compararon con los totales impresos. Las entradas suman 5.481.276 y las salidas 2.562.790, sin diferencia.</p>
        <p>Las curvas del mapa conectan lugares y muestran direcciones. No son derroteros, no reconstruyen transbordos y su grosor no representa cantidades. Los puntos animados son una ayuda de lectura. Los contingentes y viajes con fecha tienen una categoría propia y un trazo más firme.</p>
        <p>Los círculos de destinos miden una sola cosa: inmigrantes trasladados por la Oficina de Trabajo entre 1894 y 1903. No equivalen a población extranjera por provincia.</p>
        <p>La base Natural Earth representa fronteras contemporáneas. Los puntos regionales son referencias, no domicilios. Cuando los recuentos de un contingente difieren entre relatos, el texto da el rango y nombra la fuente.</p>
        <p>Consulta documental cerrada el 7 de octubre de 2026. No incluye investigación presencial ni lectura íntegra de las obras identificadas como bibliografía. Las notas de prensa están marcadas como tales.</p>
        <a href="/data/WORLD-LICENSE.txt" target="_blank" rel="noreferrer">Licencia de la base cartográfica <ArrowUpRight size={13} /></a>
      </div>
    </section>
  );
}
