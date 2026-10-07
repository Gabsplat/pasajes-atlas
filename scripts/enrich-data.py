import json
from pathlib import Path
D=Path('public/data')
def load(n):return json.loads(D.joinpath(n+'.json').read_text())
def save(n,v):D.joinpath(n+'.json').write_text(json.dumps(v,ensure_ascii=False,indent=2))
sources=load('sources')
extras=[('irish','The Camps: Irish Immigrants in Argentina','Hilda Sabato / Society for Irish Latin American Studies','https://www.irlandeses.org/sabato.htm','Estudio','Inserción productiva y organización comunitaria en la expansión lanar.'),('irishtravel','The Irish Road to South America','Edmundo Murray / Society for Irish Latin American Studies','https://www.irlandeses.org/road.htm','Estudio','Patrones de viaje y concentración regional de los orígenes.'),('volga','Colonias de alemanes del Volga en Entre Ríos','Cámara de Diputados de Entre Ríos · 2024','https://www.hcder.gov.ar/archivosDownload/textos/E27237-03072024-o.pdf','Fuente primaria','Fundamentos de un proyecto legislativo conmemorativo; establecimiento de aldeas en 1878.'),('danish','Inmigrantes y colonos: la experiencia danesa','Volumen de estudios regionales · CONICET / UBA','https://notablesdelaciencia.conicet.gov.ar/bitstream/handle/11336/108995/CONICET_Digital_Nro.7be3e8c2-8fa2-4af6-8677-2d5f679d4818_A.pdf?isAllowed=y&sequence=2','Estudio','Historia de redes y asentamientos daneses en el sudeste bonaerense.')]
for id,t,a,u,k,n in extras:
 if not any(x['id']==id for x in sources):sources.append(dict(id=id,title=t,author=a,url=u,kind=k,note=n,accessed='2026-10-07'))
save('sources',sources)
places=load('places')
for id,n,lon,lat in [('ireland','Centro de Irlanda',-7.8,53.5),('vallemaria','Valle María, Entre Ríos',-60.59,-31.99),('denmark','Dinamarca',10.0,56.0),('rio','Río de Janeiro',-43.17,-22.90),('montevideo','Montevideo',-56.16,-34.90)]:places[id]=dict(id=id,name=n,coordinates=[lon,lat])
save('places',places)
groups=load('groups')
newgroups=[dict(id='irish',name='Irlandeses',color='#638a55',summary='Redes rurales en la expansión lanar.',detail='La cría ovina articuló oportunidades, contratos y redes de trabajo. La historia irlandesa no se reduce al propietario exitoso: hubo empleados, arrendatarios y movilidad. El punto europeo representa una región de procedencia, no un puerto ni una identidad británica uniforme.',sources=['irish','irishtravel']),dict(id='volga',name='Alemanes del Volga',color='#987b59',summary='Una migración dentro de otra migración.',detail='Una comunidad de lengua alemana establecida en el Imperio ruso volvió a desplazarse. Las aldeas entrerrianas de 1878 permiten distinguir lengua, soberanía y lugar de procedencia. «Ruso» en un registro no basta para deducir lengua o pertenencia étnica.',sources=['volga']),dict(id='danish',name='Daneses',color='#777f61',summary='Una concentración local en el sudeste bonaerense.',detail='La experiencia danesa en torno de Tandil muestra el peso de redes e instituciones en contingentes menores. Su visibilidad local no debe convertirse en una proporción nacional. La conexión dibujada une región de origen y zona de asentamiento sin atribuir una travesía común a todas las familias.',sources=['danish'])]
for g in newgroups:
 if not any(x['id']==g['id'] for x in groups):groups.insert(-1,g)
save('groups',groups)
routes=load('routes')
for id,g,o,de,st,en,title,desc,so in [
('ireland-ba','irish','ireland','ba',1850,1889,'Irlanda → Buenos Aires','Las redes rurales irlandesas se vinculaban con la expansión lanar. Esta línea relaciona una zona de procedencia y la región de entrada; no identifica el puerto ni la ruta de cada pasajero.',['irish','irishtravel']),
('volga-vallemaria','volga','volga','vallemaria',1878,1913,'Del Volga a las aldeas entrerrianas','El establecimiento de colonias en 1878 es un hito documentado. La línea conecta regiones; no presupone un puerto ruso común ni reproduce los transbordos europeos de los colonos.',['volga']),
('denmark-tandil','danish','denmark','tandil',1850,1929,'Dinamarca → Tandil','Una conexión entre región de origen y asentamiento estudiada por la historia migratoria. No dibuja la vía exacta de salida de cada familia danesa.',['danish'])]:
 if not any(x['id']==id for x in routes):routes.append(dict(id=id,group=g,origin=o,destination=de,start=st,end=en,title=title,description=desc,sources=so,layer='arrival',evidence='Origen y asentamiento',via=[[-8,48],[-18,28],[-30,5],[-40,-22],[-53,-33]],geometryNote='Origen y asentamiento documentados; puntos intermedios exclusivamente esquemáticos. Sin identificación de puertos individuales ni escala de volumen.',dateNote='Intervalo editorial para una corriente histórica; no representa viajes continuos.'))
for r in routes:
 if r['id']=='massilia':
  r['stops']=['rio','montevideo']
  r['via']=[[-12,38],[-19,22],[-28,5],[-35,-10],[-43.17,-22.9],[-49,-28],[-56.16,-34.9]]
  r['dateNote']='Salida: La Rochelle, 19/10/1939. Llegada: Buenos Aires, 05/11/1939. Escalas documentadas: Río de Janeiro y Montevideo. Sin derrotero náutico diario.'
save('routes',routes)
