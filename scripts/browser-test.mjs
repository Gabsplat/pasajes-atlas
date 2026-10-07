import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const URL='http://127.0.0.1:4570';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const tab=name=>page.getByRole('navigation').getByRole('button',{name,exact:true}).click();
const saved=async(trigger,name)=>{const ev=page.waitForEvent('download');await trigger();const d=await ev;assert.equal(d.suggestedFilename(),name);const s=await d.createReadStream();let c='';for await(const k of s)c+=k;return c};
try {
 await page.goto(URL);
 await page.locator('.world-map').waitFor();
 await page.evaluate(()=>document.fonts.ready);
 assert(await page.locator('.world-map .land path').count()>200);
 assert.equal(await page.locator('path[d*="NaN"]').count(),0);
 assert(await page.locator('.era-figures strong').count()>=3);
 await page.screenshot({path:'/home/sbx/atlas-desktop.png',fullPage:true});
 // mapa: vistas, zoom, búsqueda vacía
 await page.getByRole('button',{name:'Mundo',exact:true}).click();
 await page.getByLabel('Acercar mapa',{exact:true}).click();
 await page.getByLabel('Buscar rutas',{exact:true}).fill('inexistente123');
 assert.equal(await page.locator('.route-row').count(),0);
 await page.getByLabel('Restablecer filtros').click();
 // lista sincronizada con el mapa, teclado y panel plegable
 await page.locator('.route-row').nth(2).hover();
 assert.equal(await page.locator('.route-row.hot').count(),1);
 await page.locator('.route-row').first().click();
 await page.locator('.route-detail h2').waitFor();
 const first=await page.locator('.route-detail h2').innerText();
 await page.waitForTimeout(800);
 await page.screenshot({path:'/home/sbx/atlas-detalle.png',clip:{x:0,y:380,width:1440,height:620}});
 await page.keyboard.press('ArrowRight');
 assert.notEqual(await page.locator('.route-detail h2').innerText(),first);
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('.route-detail').count(),0);
 await page.getByLabel('Ocultar panel').click();
 await page.getByLabel('Mostrar panel').click();
 await page.locator('.era-chip').nth(5).click();
 assert.match(await page.locator('.timeline-range').innerText(),/1946/);
 await page.getByLabel('Restablecer filtros').click();
 // capa de destinos y ficha de lugar
 await page.getByText('Destinos 1894–1903',{exact:true}).click();
 assert.equal(await page.locator('.destination-circle').count(),24);
 await page.screenshot({path:'/home/sbx/atlas-destinos.png',clip:{x:0,y:250,width:1440,height:750}});
 await page.getByLabel('Buscar rutas',{exact:true}).fill('Weser');
 await page.locator('.route-row').first().click();
 assert.match(await page.locator('.route-detail').innerText(),/14 de agosto/);
 await page.locator('.route-facts button').first().click();
 assert.match(await page.locator('.place-detail').innerText(),/Bremen/);
 assert(await page.locator('.place-routes button').count()>=1);
 await page.getByLabel('Restablecer filtros').click();
 // recorrido guiado completo
 await page.getByRole('button',{name:'Recorrido guiado',exact:true}).click();
 const total=Number((await page.locator('.tour-card .eyebrow').innerText()).split('/')[1]);
 assert.equal(total,9);
 const next=()=>page.locator('.tour-controls').getByRole('button',{name:'Siguiente'}).click();
 for(let i=0;i<4;i++) await next();
 assert.equal(await page.locator('.destination-circle').count(),24);
 await page.screenshot({path:'/home/sbx/atlas-tour5.png',clip:{x:0,y:250,width:1440,height:750}});
 for(let i=0;i<3;i++) await next();
 assert.match(await page.locator('.route-detail').innerText(),/Massilia/);
 assert.match(await page.locator('.stop-list').innerText(),/Montevideo/);
 await next();
 await page.locator('.tour-controls').getByRole('button',{name:'Terminar'}).click();
 // cifras
 await tab('Las cifras');
 await page.locator('.series-chart svg').waitFor();
 await page.locator('.series-chart svg').scrollIntoViewIfNeeded();
 const box=await page.locator('.series-chart svg').boundingBox();
 await page.mouse.move(box.x+box.width*0.8,box.y+box.height/2);
 assert.match(await page.locator('.chart-tip').innerText(),/Entradas/);
 await page.getByRole('button',{name:'Italia y España',exact:true}).click();
 await page.getByRole('button',{name:'Por salidas / entradas',exact:true}).click();
 await page.getByRole('button',{name:'Personas',exact:true}).click();
 assert.equal(await page.locator('.census-table tbody tr').count(),5);
 assert.equal(await page.locator('table.decades tbody tr').count(),8);
 const serie=await saved(()=>page.getByRole('button',{name:'Descargar serie anual CSV'}).click(),'pasajes-serie-anual-1857-1924.csv');
 assert.equal(serie.trim().split('\n').length,69);
 await saved(()=>page.getByRole('button',{name:'Descargar tabla CSV'}).click(),'censos-pasajes.csv');
 await page.screenshot({path:'/home/sbx/atlas-cifras.png',fullPage:true});
 await page.getByRole('button',{name:'Ver en el mapa'}).click();
 assert.equal(await page.locator('.destination-circle').count(),24);
 // investigación
 await tab('La investigación');
 assert.equal(await page.locator('.chapter-nav button').count(),27);
 assert(await page.locator('.fact-grid div').count()>=3);
 await page.getByLabel('Buscar en la investigación',{exact:true}).fill('golondrinas');
 assert(await page.locator('.chapter-nav button').count()>0);
 await page.locator('.chapter-nav button').first().click();
 assert(await page.locator('.article-body').innerText());
 await page.screenshot({path:'/home/sbx/atlas-investigacion.png'});
 // cronología
 await tab('Cronología');
 assert.equal(await page.locator('.chronology li').count(),43);
 await page.locator('.kind-filter').getByRole('button',{name:'viaje',exact:true}).click();
 assert(await page.locator('.chronology li').count()<43);
 await page.screenshot({path:'/home/sbx/atlas-cronologia.png'});
 // fuentes y corpus
 await tab('Fuentes y archivo');
 assert.equal(await page.locator('.sources-list article').count(),85);
 await page.getByLabel('Buscar fuentes',{exact:true}).fill('Massilia');
 assert(await page.locator('.sources-list article').count()>0);
 const corpus=JSON.parse(await saved(()=>page.getByRole('button',{name:'Descargar corpus'}).click(),'pasajes-corpus.json'));
 assert.equal(corpus.routes.length,50);
 assert.equal(corpus.stats.series.length,68);
 // móvil
 await page.setViewportSize({width:390,height:844});
 for(const [q,file] of [['','atlas-mobile'],['?tab=cifras','atlas-mobile-cifras'],['?tab=cronologia','atlas-mobile-cronologia'],['?tab=investigacion&cap=cases','atlas-mobile-investigacion']]){
  await page.goto(URL+'/'+q);
  await page.locator('main section').first().waitFor();
  await page.waitForTimeout(400);
  await page.screenshot({path:`/home/sbx/${file}.png`,fullPage:true});
  const over=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert(over<=0,`Mobile horizontal overflow on ${q||'atlas'}: ${over}px`);
 }
 await page.goto(URL);
 await page.getByRole('button',{name:'Menú de navegación'}).click();
 await tab('La investigación');
 assert(await page.locator('.article-body').isVisible());
 const reduced=await browser.newPage({reducedMotion:'reduce'});
 await reduced.goto(URL);await reduced.locator('.world-map').waitFor();
 assert.equal(await reduced.locator('animateMotion').count(),0);
 assert.deepEqual(errors,[]);
 console.log('PASS: map, list-map hover sync, keyboard navigation, era chips, destinations layer, place card, nine tour steps, series chart, tables, chronology, research, sources, downloads, mobile layout on four pages, reduced motion; no JS errors.');
} finally { await browser.close(); }
