// Genera la imagen de portada a partir del atlas real. Ejecutar dentro de omabox, igual que la prueba de navegador.
import { chromium } from 'playwright';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1.5});
await page.goto('http://127.0.0.1:4570');
await page.locator('.world-map').waitFor();
await page.evaluate(()=>document.fonts.ready);
await page.addStyleTag({content:`
 header,.intro,.atlas-toolbar,.map-legend,.timeline,.map-caption,.below-grid,footer,.stage-bar,.float-panel,.map-dock,.map-tools,.map-credit{display:none!important}
 body{background:#eef0e8}.atlas-shell{margin:0!important;border:0!important;border-radius:0!important}
 .stage .map-wrap{height:900px!important}
 .cover{position:fixed;left:0;top:0;bottom:0;width:760px;padding:84px 0 0 88px;background:linear-gradient(90deg,#f5f2eb 0,#f5f2ebf2 58%,#f5f2eb00 100%);z-index:9;font-family:'DM Sans',sans-serif;color:#303b33}
 .cover small{font-size:17px;letter-spacing:3px;color:#7c8872}
 .cover h1{font-family:'Libre Baskerville',serif;font-weight:400;font-size:86px;line-height:1.08;letter-spacing:-2.5px;margin:26px 0 30px}
 .cover h1 em{color:#b8593c}
 .cover p{font-size:25px;line-height:1.5;color:#5f6a58;max-width:520px;margin:0}
 .cover .nums{display:flex;gap:44px;margin-top:54px}
 .cover .nums b{display:block;font-family:'Libre Baskerville',serif;font-weight:400;font-size:46px;color:#b8593c}
 .cover .nums span{font-size:17px;color:#6f7a66}
 .cover .foot{position:absolute;left:88px;bottom:64px;font-size:19px;color:#7c8872}
 .cover .foot strong{color:#303b33;font-family:'Libre Baskerville',serif;font-weight:400;font-size:27px;margin-right:16px}
`});
await page.evaluate(()=>{const d=document.createElement('div');d.className='cover';d.innerHTML=`<small>EUROPA → ARGENTINA · 1850–1960</small><h1>Un océano.<br><em>Millones de cruces.</em></h1><p>Atlas interactivo de la inmigración europea, con las cifras de los registros de la época.</p><div class="nums"><div><b>5,48 M</b><span>entradas, 1857–1924</span></div><div><b>2,56 M</b><span>salidas</span></div><div><b>29,9 %</b><span>extranjeros en 1914</span></div></div><div class="foot"><strong>pasajes.</strong>pasajes-atlas.gaabgames.workers.dev</div>`;document.body.appendChild(d)});
// encuadre: Atlántico desplazado a la derecha del texto
await page.mouse.move(1200,450);await page.mouse.down();await page.mouse.move(1390,470,{steps:8});await page.mouse.up();
await page.mouse.move(40,40);
await page.waitForTimeout(700);
await page.screenshot({path:'/home/sbx/portada.png'});
await browser.close();console.log('portada lista');
