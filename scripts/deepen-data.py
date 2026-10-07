"""Tercer paso de la generación de datos.

Agrega series estadísticas transcritas de fuentes primarias, nuevas fuentes,
lugares, contingentes documentados, cronología y cifras por época.
Ejecutar después de make-data.py y enrich-data.py, y antes de make-research.py.
"""
import json
from pathlib import Path

D = Path('public/data')
def load(n): return json.loads(D.joinpath(n + '.json').read_text())
def save(n, v): D.joinpath(n + '.json').write_text(json.dumps(v, ensure_ascii=False, indent=2))

# ---------------------------------------------------------------- fuentes
sources = load('sources')
def s(id, title, author, url, kind='Estudio', note=''):
    row = dict(id=id, title=title, author=author, url=url, kind=kind, note=note, accessed='2026-10-07')
    for i, x in enumerate(sources):
        if x['id'] == id:
            sources[i] = row
            return
    sources.append(row)

s('willcox', 'International Migrations, vol. I: Statistics. Tablas nacionales de Argentina', 'Imre Ferenczi y Walter F. Willcox · NBER, 1929', 'https://www.nber.org/chapters/c5136', 'Estadística histórica', 'Páginas 539–547. Reproduce las series de la Dirección General de Inmigración: pasajeros extranjeros de segunda y tercera clase por vía marítima, 1857–1924, con sexo, edad, ocupación y nacionalidad. Transcripción propia, verificada contra los totales impresos.')
s('bunge', 'Argentina, en International Migrations, vol. II: Interpretations', 'Alejandro E. Bunge y Carlos García Mata · NBER, 1931', 'https://www.nber.org/chapters/c5106', 'Estudio', 'Páginas 143–160. Lectura crítica de las estadísticas oficiales, saldos por década 1857–1926, inmigración golondrina, pasajes subsidiados y datos del censo de 1914.')
s('stlouis', 'The Immigration Offices and Statistics from 1857 to 1903', 'Departamento de Inmigración, Ministerio de Agricultura · 1904', 'https://www.gutenberg.org/ebooks/39230', 'Fuente primaria', 'Folleto oficial para la Exposición de St. Louis. Incluye artículos de la Ley 817, raciones del Hotel de Inmigrantes, oficios declarados 1894–1903 e inmigrantes internados por provincia. Es un texto de propaganda estatal y hay que leerlo como tal.')
s('modolo', 'Análisis histórico-demográfico de la inmigración en la Argentina del Centenario al Bicentenario', 'Vanina Edit Modolo · Papeles de Población 22 (89), 2016', 'https://www.redalyc.org/pdf/112/11248009008.pdf', 'Estudio', 'Series censales 1869–2010 y proporción de nacidos en países limítrofes dentro de la población extranjera.')
s('calzini', 'Patrones de localización de italianos y españoles en la provincia de Buenos Aires, 1869–1914', 'Gianfranco Calzini · XVIII Jornadas AEPA, 2025', 'https://www.aacademica.org/xviii.jornadas.aepa/2', 'Estudio', 'Cuadro 1 con población total, extranjera, italiana y española de la provincia en cinco censos.')
s('scarzanella', 'Italia y la emigración a América Latina: acuerdos bilaterales y participación en el CIME, 1946–1957', 'Eugenia Scarzanella · História Unisinos 22 (2), 2018', 'https://www.redalyc.org/journal/5798/579862687005/579862687005.pdf', 'Estudio', 'Cifras ISTAT de salidas desde Italia por destino, acuerdos de 1947 y 1948, y traslados financiados por el CIME.')
s('ushmm', 'El refugio en América Latina', 'United States Holocaust Memorial Museum · Enciclopedia del Holocausto', 'https://encyclopedia.ushmm.org/content/es/article/refuge-in-latin-america', 'Institucional', 'Admisiones oficiales de refugiados judíos por país, ingresos irregulares estimados y fechas de las leyes restrictivas.')
s('circular11', 'Circular 11: la historia secreta de la orden que prohibió el ingreso de judíos', 'La Nación · 13 de julio de 2022', 'https://www.lanacion.com.ar/lifestyle/circular-11-la-historia-secreta-de-la-orden-que-prohibio-el-ingreso-de-judios-a-la-argentina-durante-nid13072022/', 'Prensa', 'Relato periodístico con citas del texto de la circular y del hallazgo de Beatriz Gurevich en la embajada de Estocolmo. Sin cifras de visas denegadas.')
s('newton', 'Indifferent Sanctuary: German-Speaking Refugees and Exiles in Argentina, 1933–1945', 'Ronald C. Newton · Journal of Interamerican Studies and World Affairs, 1982', 'https://www.cambridge.org/core/journals/journal-of-interamerican-studies-and-world-affairs/article/indifferent-sanctuary-germanspeaking-refugees-and-exiles-in-argentina-19331945/F532ABCF8E0515C697F962EFF1038AC2', 'Bibliografía', 'Resumen consultado. Estudio clásico sobre refugiados de habla alemana; no se leyó el artículo completo.')
s('ceana', 'Informe final de la Comisión para el Esclarecimiento de las Actividades del Nazismo en la Argentina', 'CEANA · Ministerio de Relaciones Exteriores, 1999', 'https://cdi.mecon.gob.ar/bases/docelec/ceana/03.pdf', 'Fuente primaria', 'Documento localizado, no leído de forma íntegra. La cifra de al menos 180 criminales de guerra identificados se toma de la cobertura de prensa de 1999 y debe citarse como estimación de la comisión.')
s('alvarez', 'Ley de Residencia, clase trabajadora y género. Aplicación y alcance de la ley 4.144 en Argentina, 1902–1914', 'Carlos Álvarez · Ariadna Ediciones, 2026', 'https://www.aacademica.org/carlos.alvarez/44', 'Estudio', 'Reconstruye decretos y deportaciones a partir del libro Copiador Anarquismo de la Policía de la Capital.')
s('farias', 'La emigración gallega a la Argentina en la segunda posguerra: el caso de Catoira', 'Ruy Farías · Odisea. Revista de Estudios Migratorios 2, 2015', 'https://dialnet.unirioja.es/descarga/articulo/6161254.pdf', 'Estudio', 'Estudio de un municipio de Pontevedra y de su asociación de residentes en Buenos Aires, 1945–1965.')
s('volgacenter', 'Volga German Immigration to Argentina', 'Center for Volga German Studies · Concordia University', 'https://www.volgagermans.org/history/immigration/argentina', 'Archivo', 'Negociación de 1877, llegada del primer grupo y población de las colonias a fines de 1878.')
s('sinay', 'Los crímenes de Moisés Ville, capítulo 1: El viaje', 'Javier Sinay · extracto publicado por Columbia Journal, 2022', 'https://www.columbiajournal.org/archive/2022-excerpt-from-chapter-1-the-journey-from-the-murders-of-moiss-ville', 'Bibliografía', 'Extracto del libro. Viaje del Weser, recuentos divergentes de familias y contrato con Pedro Palacios.')
s('pigue', 'Fundación de Pigüé: proyecto de declaración', 'Cámara de Diputados de la provincia de Buenos Aires · 2018', 'https://intranet.hcdiputados-ba.gov.ar/proyectos/10-11D4005012018-06-0510-31-53.pdf', 'Fuente primaria', 'Texto legislativo conmemorativo. Sirve para fechas y nombres; los recuentos de familias varían entre relatos.')
s('caroya', 'Los inicios de Colonia Caroya, según la historiadora Marta Copetti', 'Cadena 3 · nota periodística', 'https://www.cadena3.com/noticia/sociedad/amante-de-la-historia-cuenta-los-inicios-de-colonia-caroya_319271', 'Prensa', 'Testimonio de historia local. Las fechas de llegada y el número de familias difieren entre relatos.')
s('sanjose', 'Piemontesi nel mondo: la colonia San José de Entre Ríos', 'Regione Piemonte · documento de divulgación', 'https://www.regione.piemonte.it/web/media/22093/download', 'Institucional', 'Cita el trabajo de Carlota Guzzo Conte-Grand sobre el censo de 1869 en la colonia. Documento localizado por búsqueda, sin lectura íntegra.')
s('dutch', 'Tres Arroyos y aquellos gauchos holandeses', 'La Nación · suplemento Campo', 'https://www.lanacion.com.ar/economia/campo/tres-arroyos-y-aquellos-gauchos-holandeses-nid1584909/', 'Prensa', 'Nota periodística sobre el contingente de 1889.')
s('sirio', 'Navegación e historia de la ciencia: el naufragio del Sirio', 'Universidad Pablo de Olavide · ficha de investigación', 'https://investiga.upo.es/documentos/60482415301d210dbc375ac0', 'Estudio', 'Resumen consultado. El número de víctimas difiere entre fuentes.')
s('asturias', 'Príncipe de Asturias: el barco español que se hundió entre Barcelona y Buenos Aires', 'Billiken · nota de divulgación', 'https://billiken.lat/historia/principe-de-asturias-la-historia-de-este-barco-espanol-que-se-hundio-en-un-viaje-entre-barcelona-y-buenos-aires-con-las-piezas-originales-de-un-monumento-porteno/', 'Prensa', 'Divulgación. Fechas y cifras aproximadas del naufragio de 1916.')
save('sources', sources)

# ------------------------------------------------- series anuales 1857-1924
# Willcox (1929), tablas I, IV y V. Pasajeros extranjeros de segunda y tercera
# clase, vía marítima. Excluye primera clase y el movimiento fluvial con Montevideo.
YEARS = list(range(1857, 1925))
IMM = [4951,4658,4735,5656,6301,6716,10408,11682,11767,13696,13225,25919,28958,30898,15088,26218,48382,40674,18332,14532,14675,23624,32717,26643,31431,41041,52472,49623,80618,65655,94608,129115,218744,77815,28266,39973,52067,54720,61226,102673,72978,67130,84442,84851,90127,57992,75227,125567,177117,252536,209103,255710,231084,289640,225772,323403,302047,115321,45290,32990,18064,13701,41299,87032,98086,129263,195063,159939]
EM_1871 = [10686,9153,18236,21340,25578,13487,18350,14860,23696,20377,22374,8720,9510,14444,14585,13907,13630,16842,40649,48794,72380,29893,26055,20586,20390,20415,31192,30802,38397,38334,48697,44558,40610,38923,42869,60124,90190,85412,94644,97854,120709,120260,156829,178684,111459,73348,50995,24075,42279,57187,44638,45993,46810,46105]
EM = [None] * 14 + EM_1871
IT_IMM = [3021,2976,3009,3349,4807,4902,7836,8422,7697,9212,7221,18937,21419,23101,8170,14769,26878,23904,9130,6950,7556,13514,22774,18416,20506,29587,37043,31983,63501,43328,65139,75029,88647,39122,15511,27850,37977,37699,41203,75202,45678,39135,53295,52143,58314,32314,42358,67598,88950,127348,90282,93479,93528,102019,58185,80583,114252,36122,11309,5205,1698,855,8966,30213,39965,57827,91992,73119]
IT_EM = [1216,1151,1612,1633,2646,2514,3979,5507,3853,4861,4133,9667,12902,13854,5518,9977,18845,16910,6422,5876,5389,10474,17729,17696,3330,2691,4631,1315,15514,13265,16936,10179,13048,47408,57920,14678,13024,19905,11341,14705,23516,20644,25604,23138,22089,12315,16280,23970,26122,37534,57686,48065,51642,48398,60329,48063,59920,60602,55775,21364,11422,3608,8380,20915,16329,14472,14153,16200]
ES_IMM = [854,784,802,930,786,934,1092,1608,1981,2074,3186,3834,3744,3388,2554,4411,9185,8272,4036,3463,2700,3371,3422,3112,3444,3520,5023,6832,4314,9895,15618,25407,71151,13560,4290,5650,7100,8122,11288,18051,18316,18716,19798,20383,18066,13911,21917,39851,53029,79517,82606,125497,86798,131466,118723,165662,122271,52186,25250,21768,12499,9188,20824,40722,40119,43305,48428,45691]
ES_EM = [356,531,288,376,369,480,503,818,1010,274,789,950,1055,812,1113,1822,4018,3570,1788,1530,1205,1517,1872,1395,1413,1118,1753,1516,939,1974,2009,4933,4798,3814,10159,2938,4161,5127,7824,9666,1229,1663,7520,7876,5634,4353,10018,19020,19533,12556,18486,23701,27464,23719,39801,41118,59133,77646,45205,42558,33838,17545,21599,29172,18182,19289,19063,16763]
assert len(IMM) == len(IT_IMM) == len(IT_EM) == len(ES_IMM) == len(ES_EM) == 68
assert sum(IMM) == 5481276, sum(IMM)
assert sum(EM_1871) + 8900 + 82976 == 2562790
assert sum(IT_IMM) == 2604029 and sum(IT_EM) == 1292789 and sum(ES_IMM) == 1780295
assert abs(sum(ES_EM) - 756262) <= 10  # la suma anual difiere en 5 del total impreso

series = [dict(year=y, immigrants=IMM[i], emigrants=EM[i], net=(IMM[i] - EM[i]) if EM[i] is not None else None,
               italianIn=IT_IMM[i], italianOut=IT_EM[i], spanishIn=ES_IMM[i], spanishOut=ES_EM[i]) for i, y in enumerate(YEARS)]

# Nacionalidades, totales 1857-1924 (tabla V). Denominaciones de la fuente.
NAT = [
    ('Italianos', 2604029, 1292789, 'italian'), ('Españoles', 1780295, 756262, 'spanish'), ('Franceses', 226894, 120258, 'french'),
    ('Rusos', 169257, 70899, 'eastern'), ('Otomanos («turcos»)', 157185, 53513, None), ('Alemanes', 100699, 49252, 'german'),
    ('Austrohúngaros', 91869, 37802, 'eastern'), ('Británicos', 64426, 45370, 'welsh'), ('Portugueses', 38196, 17465, None),
    ('Suizos', 37017, 14709, 'swiss'), ('Polacos (desde 1915)', 24714, 1179, 'eastern'), ('Belgas', 24142, 6812, None),
    ('Daneses', 12896, 3869, 'danish'), ('Yugoslavos (desde 1915)', 9250, 1015, None), ('Estadounidenses', 9028, 5527, None),
    ('Neerlandeses', 8751, 4266, None), ('Suecos', 2664, 1171, None), ('Sin especificar', 119964, 80632, None)]
assert sum(n[1] for n in NAT) == 5481276, sum(n[1] for n in NAT)
nationalities = [dict(name=n, immigrants=i, emigrants=e, net=i - e, ratio=round(e / i * 100, 1), group=g) for n, i, e, g in NAT]

# Bunge y García Mata (1931), tabla 50, en miles; tablas 53 y 55.
decades = [dict(period=p, immigrants=i, emigrants=e, balance=b, malePercent=m, hotelPercent=h) for p, i, e, b, m, h in [
    ('1857–60', 20, 9, 11, 80.5, 3.0), ('1861–70', 160, 83, 77, 76.4, 15.9), ('1871–80', 261, 176, 85, 70.4, 32.7),
    ('1881–90', 841, 203, 638, 69.6, 49.8), ('1891–1900', 648, 328, 320, 70.6, 43.0), ('1901–10', 1764, 644, 1120, 72.6, 47.1),
    ('1911–20', 1205, 936, 269, 69.9, None), ('1921–26', 843, 289, 554, 70.2, 38.4)]]

# Departamento de Inmigración (1904): inmigrantes internados por la Oficina de Trabajo, 1894-1903.
INTERIOR = [
    ('Santa Fe', 97037, -60.9, -30.9), ('Buenos Aires', 91746, -60.3, -36.6), ('Córdoba', 28498, -63.8, -32.2), ('Mendoza', 17454, -68.6, -34.2),
    ('Entre Ríos', 12838, -59.2, -32.0), ('Capital Federal', 12538, -58.42, -34.61), ('Tucumán', 7128, -65.35, -26.95), ('Misiones', 4923, -54.7, -26.9),
    ('San Juan', 2254, -68.9, -30.9), ('Corrientes', 1778, -57.8, -28.8), ('Pampa Central', 1305, -65.4, -37.1), ('Santiago del Estero', 1259, -63.3, -27.8),
    ('San Luis', 1239, -66.0, -33.8), ('Salta', 1170, -64.8, -24.9), ('Jujuy', 858, -65.8, -23.2), ('Río Negro', 828, -67.2, -40.4),
    ('Chubut', 688, -68.5, -43.8), ('Chaco', 402, -60.8, -26.4), ('Santa Cruz', 390, -69.9, -48.8), ('Formosa', 328, -59.9, -24.9),
    ('La Rioja', 209, -67.0, -29.7), ('Tierra del Fuego', 188, -67.8, -54.2), ('Catamarca', 161, -66.9, -27.3), ('Neuquén', 152, -70.1, -38.6)]
assert sum(x[1] for x in INTERIOR) == 285371, sum(x[1] for x in INTERIOR)
interior = [dict(name=n, forwarded=v, percent=round(v / 285371 * 100, 1), coordinates=[lon, lat]) for n, v, lon, lat in INTERIOR]

trades = [dict(name=n, value=v) for n, v in [
    ('Agricultores', 312723), ('Jornaleros', 118223), ('Niños, sin oficio', 113433), ('Comerciantes', 30996), ('Sirvientes y sirvientas', 28450),
    ('Costureras', 28194), ('Dependientes', 10755), ('Cocineros y cocineras', 9265), ('Lavanderas', 8749), ('Albañiles', 8500),
    ('Mujeres sin oficio declarado', 8111), ('Marineros', 7739), ('Carpinteros', 7142), ('Tejedores y tejedoras', 6546), ('Zapateros', 6094), ('Modistas', 6051)]]

stats = dict(
    series=series,
    seriesNote='Pasajeros extranjeros de segunda y tercera clase llegados o salidos por vía marítima. No incluye primera clase ni el tráfico fluvial con Montevideo. Una persona que cruzó varias veces cuenta varias veces. La emigración anual se publica desde 1871; para 1857–1870 la fuente da 8.900 y 82.976 salidas agrupadas.',
    seriesTotals=dict(immigrants=5481276, emigrants=2562790, net=5481276 - 2562790, from_=1857, to=1924),
    nationalities=nationalities,
    nationalitiesNote='Nacionalidad según la clasificación administrativa de la época. «Rusos» incluye judíos del Imperio ruso y alemanes del Volga; «otomanos» incluye sirios y libaneses; «austrohúngaros» reúne a súbditos de muchas lenguas. La relación entre salidas y entradas no es una tasa de retorno por cohorte.',
    decades=decades,
    interior=interior,
    interiorNote='Inmigrantes que la Oficina de Trabajo trasladó con pasaje del Estado entre 1894 y 1903: 285.371 personas sobre 751.366 llegadas en esos diez años. Quien se quedaba por su cuenta en Buenos Aires no figura, y por eso la Capital aparece con pocos casos.',
    trades=trades,
    tradesTotal=751366,
    tradesNote='Oficio declarado al desembarcar, 1894–1903. La categoría «agricultor» daba acceso a los beneficios de la ley y no prueba la ocupación posterior.',
    census=[
        dict(year=1869, total=1737076, foreign=210295, percent=12.1, nonBorder=80.3, urban=26.4),
        dict(year=1895, total=3954911, foreign=1004527, percent=25.4, nonBorder=88.5, urban=37.4),
        dict(year=1914, total=7885237, foreign=2357952, percent=29.9, nonBorder=91.4, urban=52.7),
        dict(year=1947, total=15893827, foreign=2435927, percent=15.3, nonBorder=87.1, urban=62.5),
        dict(year=1960, total=20013793, foreign=2604447, percent=13.0, nonBorder=82.1, urban=None)],
    censusNote='1869–1947: cuadro 9 del censo de 1947. 1960 y proporción de nacidos fuera de los países limítrofes: Modolo (2016), con base en INDEC. «No limítrofes» incluye orígenes no europeos, como el Imperio otomano.',
    comparison=[
        dict(country='Argentina', year=1914, percent=29.9), dict(country='Canadá', year=1931, percent=22.2), dict(country='Australia', year=1933, percent=17.3),
        dict(country='Argentina', year=1947, percent=15.3), dict(country='Estados Unidos', year=1940, percent=10.1), dict(country='Brasil', year=1920, percent=5.2)],
    comparisonNote='Cuadro 8 del censo argentino de 1947. La cifra de Estados Unidos excluye a la población negra y la de Australia cubre tres estados. Sirve como orden de magnitud.',
    facts1914=[
        dict(value='52 %', label='de los varones mayores de 20 años había nacido en el extranjero'),
        dict(value='68 %', label='de los extranjeros vivía en centros urbanos: 1.611.000 frente a 747.000 en el campo'),
        dict(value='930.000', label='italianos y 830.000 españoles, juntos el 23,5 % de la población'),
        dict(value='94.000', label='«rusos» y 64.000 «otomanos», según las categorías del censo')],
    postwar=[
        dict(period='1946–1951', value=346153, label='salidas de Italia hacia Argentina, datos ISTAT'),
        dict(period='1952–1959', value=149489, label='salidas de Italia hacia Argentina, datos ISTAT'),
        dict(period='1952–1959', value=88209, label='de esos traslados, financiados por el CIME')],
    refuge=[
        dict(period='1918–1933', value=79000, label='inmigrantes judíos admitidos, según el USHMM'),
        dict(period='1933–1943', value=24000, label='admitidos de forma oficial'),
        dict(period='1933–1943', value=20000, label='ingresos irregulares estimados desde países vecinos'),
        dict(period='1947–1953', value=4800, label='sobrevivientes del Holocausto radicados, como mínimo')])
save('stats', stats)

# ---------------------------------------------------------------- lugares
places = load('places')
def p(id, name, lon, lat, kind='', note=''):
    places[id] = dict(id=id, name=name, coordinates=[lon, lat], kind=kind, note=note)
KINDS = {'genoa': 'Puerto', 'naples': 'Puerto', 'trieste': 'Puerto', 'vigo': 'Puerto', 'coruna': 'Puerto', 'barcelona': 'Puerto', 'bordeaux': 'Puerto', 'havre': 'Puerto', 'hamburg': 'Puerto', 'bremen': 'Puerto', 'liverpool': 'Puerto', 'rochelle': 'Puerto', 'ba': 'Puerto de llegada', 'rosario': 'Ciudad', 'esperanza': 'Colonia', 'sanjose': 'Colonia', 'moises': 'Colonia', 'mendoza': 'Ciudad', 'cordoba': 'Ciudad', 'apostoles': 'Colonia', 'eldorado': 'Colonia', 'madryn': 'Desembarco', 'gaiman': 'Colonia', 'tandil': 'Ciudad', 'pigüé': 'Colonia', 'volga': 'Región de origen', 'galitzia': 'Región de origen', 'swiss': 'Región de origen', 'france': 'Región de origen', 'ny': 'Otro destino', 'santos': 'Otro destino', 'halifax': 'Otro destino', 'sydney': 'Otro destino', 'london': 'Puerto', 'ireland': 'Región de origen', 'vallemaria': 'Colonia', 'denmark': 'Región de origen', 'rio': 'Escala', 'montevideo': 'Escala'}
NOTES = {
    'genoa': 'Principal puerto italiano de la emigración al Plata. Entre 1857 y 1924 la estadística argentina anotó 2.604.029 entradas de italianos y 1.292.789 salidas, sin distinguir puerto.',
    'ba': 'Entrada de casi toda la inmigración ultramarina. En 1914, según Bunge y García Mata, había en la Capital casi tres extranjeros por cada argentino mayor de 20 años.',
    'bremen': 'Puerto del Weser. De aquí partió en julio de 1889 el vapor que llevó a los fundadores de Moisés Ville.',
    'liverpool': 'De 6.447 irlandeses llegados a Buenos Aires entre 1822 y 1929 con puerto conocido, el 54 % embarcó aquí. También fue el puerto del Mimosa.',
    'esperanza': 'Colonia agrícola organizada en 1856 con familias suizas, alemanas, francesas y de otros orígenes.',
    'sanjose': 'Fundada el 2 de julio de 1857 en campos de Urquiza, con colonos del Valais, Saboya y Piamonte que iban a Corrientes.',
    'moises': 'Colonia fundada en 1889 por familias judías de Podolia llegadas en el Weser. La Jewish Colonization Association la incorporó después.',
    'madryn': 'Lugar del desembarco galés de fines de julio de 1865. El Mimosa llegó a Golfo Nuevo la noche del 26.',
    'pigüé': 'Colonia de familias del Aveyron. El contingente salió de Rodez el 23 de octubre de 1884 y llegó a la estación el 3 de diciembre.',
    'vallemaria': 'Zona de las aldeas de Colonia General Alvear, departamento Diamante. A fines de 1878 vivían 1.003 alemanes del Volga en Entre Ríos.',
    'rosario': 'Segundo puerto cerealero. Santa Fe recibió 97.037 de los 285.371 inmigrantes internados por el Estado entre 1894 y 1903.',
    'mendoza': 'La provincia recibió 17.454 inmigrantes internados por el Estado entre 1894 y 1903, cuarta en la lista.',
    'volga': 'Colonias alemanas fundadas desde la década de 1760. La pérdida de sus privilegios en 1874 abrió la emigración a América.',
    'ireland': 'Westmeath, Longford y Wexford concentran la mayor parte de los orígenes documentados.',
    'montevideo': 'Escala y puerta alternativa. Entre 1867 y 1903 la estadística argentina anotó 846.572 entradas por la vía de Montevideo, sin distinguir pasajeros de inmigrantes.'}
for id, pl in places.items():
    pl.setdefault('kind', KINDS.get(id, 'Lugar'))
    pl['kind'] = KINDS.get(id, pl['kind'])
    pl['note'] = NOTES.get(id, pl.get('note', ''))
p('podolia', 'Podolia (Kamianets-Podilskyi)', 26.58, 48.68, 'Región de origen', 'Provincia del Imperio ruso de donde salieron las familias del Weser en 1889.')
p('aveyron', 'Aveyron (Rodez)', 2.57, 44.35, 'Región de origen', 'Departamento del sur de Francia. De aquí partieron en 1884 las familias que fundaron Pigüé.')
p('valais', 'Valais', 7.36, 46.23, 'Región de origen', 'Cantón suizo de donde vino la mayoría de los colonos de San José en 1857.')
p('friuli', 'Friuli', 13.23, 46.06, 'Región de origen', 'Región del nordeste italiano. Sus familias llegaron en 1878 a Colonia Caroya y a otras colonias nacionales.')
p('netherlands', 'Frisia y Groninga', 5.9, 53.2, 'Región de origen', 'Norte de los Países Bajos. En 1889 la estadística argentina anotó 4.007 neerlandeses; el año anterior habían sido 68.')
p('queenstown', 'Queenstown (Cobh)', -8.29, 51.85, 'Puerto', 'Segundo puerto de los irlandeses rumbo al Plata: 28 % de los embarques con puerto conocido.')
p('hinojo', 'Colonia Hinojo', -60.17, -36.99, 'Colonia', 'Primera colonia de alemanes del Volga. El grupo inicial llegó al arroyo Hinojo el 5 de enero de 1878, en tren hasta Azul y después en carretas.')
p('caroya', 'Colonia Caroya', -64.07, -31.03, 'Colonia', 'Colonia nacional creada por ley de 1876 en tierras de la antigua estancia jesuítica. Las familias friulanas llegaron en 1878.')
p('tresarroyos', 'Tres Arroyos', -60.28, -38.38, 'Colonia', 'Destino del contingente neerlandés de 1889 y de familias danesas.')
p('cabopalos', 'Cabo de Palos', -0.69, 37.63, 'Naufragio', 'El vapor Sirio encalló aquí el 4 de agosto de 1906, dos días después de salir de Génova.')
p('ilhabela', 'Ilhabela', -45.25, -23.95, 'Naufragio', 'El Príncipe de Asturias se hundió frente a esta costa en marzo de 1916.')
save('places', places)

# ----------------------------------------------------------------- grupos
groups = load('groups')
EXTRA = {
    'italian': ' La estadística argentina anotó 2.604.029 entradas y 1.292.789 salidas de italianos entre 1857 y 1924. Hasta 1870 eran cerca del 70 % de las llegadas. Después de 1945 Italia registró 346.153 salidas hacia Argentina en seis años.',
    'spanish': ' Entre 1857 y 1924 se anotaron 1.780.295 entradas y 756.262 salidas. Desde 1908 las llegadas españolas superaron a las italianas casi todos los años hasta la guerra. Los estudios sitúan a los gallegos entre el 45 % y el 55 % del total.',
    'french': ' Fueron 226.894 entradas y 120.258 salidas entre 1857 y 1924. En los tres años de pasajes subsidiados, de 1888 a 1890, llegaron unos 61.000.',
    'swiss': ' La serie oficial cuenta 37.017 entradas de suizos entre 1857 y 1924. San José, en Entre Ríos, recibió en 1857 a colonos del Valais.',
    'german': ' La serie oficial cuenta 100.699 entradas de alemanes entre 1857 y 1924, con un salto en la década de 1920: más de 10.000 por año en 1923 y 1924.',
    'eastern': ' En la estadística portuaria aparecen como «austrohúngaros» (91.869 entradas hasta 1924), «rusos» (169.257) y, desde 1915, «polacos» y «yugoslavos».',
    'jewish': ' El Weser llegó el 14 de agosto de 1889 con unas 824 personas de Podolia. Entre 1933 y 1943 el Estado admitió oficialmente a unos 24.000 refugiados judíos y otros 20.000 entraron de forma irregular, según el USHMM.',
    'welsh': ' Unos 150 pasajeros, en su mayoría de zonas mineras como Mountain Ash y Aberdare. Llegaron a Golfo Nuevo la noche del 26 de julio de 1865.',
    'irish': ' Las estimaciones van de 10.500 a 11.500 radicados (Sabato y Korol) hasta 40.000 o 45.000 emigrados con la mitad de reemigración (McKenna). Westmeath aporta el 43 % de los orígenes documentados.',
    'volga': ' El primer grupo llegó a Buenos Aires el 24 de diciembre de 1877 y fundó Hinojo el 5 de enero de 1878. A fines de ese año había 1.003 colonos en Entre Ríos, 379 en Buenos Aires y 152 en Santa Fe.',
    'danish': ' La serie oficial cuenta 12.896 entradas de daneses entre 1857 y 1924 y solo 3.869 salidas, una de las relaciones más bajas.',
    'exile': ' El Massilia zarpó de La Rochelle el 19 de octubre de 1939 y llegó a Buenos Aires el 5 de noviembre.',
    'global': ' Entre 1946 y 1951 salieron de Italia 56.337 personas hacia Venezuela y 34.542 hacia Brasil, frente a 346.153 hacia Argentina.'}
SRC = {'italian': ['willcox', 'scarzanella'], 'spanish': ['willcox', 'farias'], 'french': ['willcox', 'bunge', 'pigue'], 'swiss': ['willcox', 'sanjose'], 'german': ['willcox'], 'eastern': ['willcox'], 'jewish': ['sinay', 'ushmm'], 'welsh': [], 'irish': [], 'volga': ['volgacenter'], 'danish': ['willcox'], 'exile': [], 'global': ['scarzanella']}
for g in groups:
    extra = EXTRA.get(g['id'])
    if extra and extra.strip() not in g['detail']:
        g['detail'] += extra
    for sid in SRC.get(g['id'], []):
        if sid not in g['sources']:
            g['sources'].append(sid)
if not any(g['id'] == 'dutch' for g in groups):
    groups.insert(-1, dict(id='dutch', name='Neerlandeses y belgas', color='#b0855a', summary='El año de los pasajes subsidiados.', detail='En 1889 el Estado argentino adelantó pasajes a unas 100.000 personas. La serie oficial muestra el efecto en orígenes poco habituales: 4.007 neerlandeses frente a 68 el año anterior, y 8.666 belgas frente a 3.201. Tres Arroyos recibió familias de Frisia y Groninga. Varias regresaron tras la crisis de 1890. En total se anotaron 8.751 entradas de neerlandeses y 24.142 de belgas entre 1857 y 1924.', sources=['willcox', 'bunge', 'dutch']))
save('groups', groups)

# ------------------------------------------------------------------ rutas
routes = load('routes')
med = [[4, 39], [-5.7, 35.9], [-14, 28], [-25, 8], [-33, -7], [-40, -20], [-50, -30]]
atl = [[-12, 38], [-19, 22], [-28, 5], [-35, -10], [-43, -25], [-52, -33]]
north = [[-5, 50], [-12, 42], [-19, 25], [-28, 5], [-35, -10], [-43, -25], [-52, -33]]
GEO = 'Conexión esquemática entre lugares documentados. Los puntos intermedios son una guía visual y no reproducen el derrotero. El grosor y la animación no representan volumen ni velocidad.'
def r(id, group, origin, dest, start, end, title, text, src, layer='arrival', evidence='Corriente histórica', via=None, stops=None, date=None):
    row = dict(id=id, group=group, origin=origin, destination=dest, start=start, end=end, title=title, description=text, sources=src, layer=layer, evidence=evidence, via=via or [], geometryNote=GEO,
               dateNote=date or ('Fecha del contingente o del viaje documentado.' if start == end else 'Ventana histórica orientativa de la corriente; no afirma viajes en cada año.'))
    if stops: row['stops'] = stops
    for i, x in enumerate(routes):
        if x['id'] == id:
            routes[i] = row
            return
    routes.append(row)

r('weser', 'jewish', 'bremen', 'ba', 1889, 1889, 'Weser · Bremen → Buenos Aires', 'El vapor Weser zarpó de Bremen en julio de 1889 con familias judías de Podolia, en el Imperio ruso. Ancló en Buenos Aires el 14 de agosto y los pasajeros recién pudieron desembarcar el 17. Javier Sinay cuenta 824 personas en 136 familias, y advierte que otros recuentos dan entre 88 y 130 familias. Las tierras prometidas estaban ocupadas. El 28 de agosto firmaron un contrato con Pedro Palacios por lotes de 25 hectáreas en Santa Fe, donde nació Moisés Ville.', ['sinay', 'jewish'], evidence='Viaje documentado', via=[[7.5, 54.2], [2.5, 52], [-5, 49.5], [-12, 42], [-19, 25], [-28, 5], [-35, -10], [-43, -25], [-52, -33.5]], date='Llegada a Buenos Aires: 14/08/1889. Desembarco: 17/08/1889. Sin derrotero náutico.')
r('volga-hinojo', 'volga', 'volga', 'hinojo', 1878, 1878, 'Del Volga a Hinojo', 'En agosto de 1877 cuatro delegados de un grupo establecido en el sur de Brasil negociaron en Buenos Aires con el ministro Bernardo de Irigoyen. Pedían tierra apta para trigo, exención del servicio militar, libertad de culto y escuela en alemán. El primer grupo, ocho familias y tres solteros, llegó a Buenos Aires el 24 de diciembre de 1877. Viajó en tren hasta Azul y en carretas hasta el arroyo Hinojo, adonde llegó el 5 de enero de 1878.', ['volgacenter', 'volga'], evidence='Contingente documentado', via=[[-8, 48], [-18, 28], [-30, 5], [-40, -22], [-53, -33], [-58.38, -34.6], [-59.86, -36.78]], date='Llegada a Buenos Aires: 24/12/1877. Llegada a Hinojo: 05/01/1878. La línea no reproduce la salida de Rusia ni el paso previo por Brasil de otros grupos.')
r('aveyron-pigue', 'french', 'aveyron', 'pigüé', 1884, 1884, 'Del Aveyron a Pigüé', 'Clément Cabanettes y François Issaly reunieron a unas cuarenta familias del Aveyron. El grupo salió de Rodez el 23 de octubre de 1884, embarcó en Burdeos y llegó a la estación de Pigüé el 3 de diciembre. La fundación se conmemora el 4. Los relatos difieren en el recuento: unos hablan de cuarenta familias y otros de 162 personas. Entre los colonos había agricultores, albañiles, un herrero, un maestro y un sacerdote.', ['pigue', 'otero'], evidence='Contingente documentado', stops=['bordeaux', 'ba'], via=[[-0.58, 44.84], *atl, [-58.38, -34.6]], date='Salida de Rodez: 23/10/1884. Llegada a Pigüé: 03/12/1884.')
r('valais-sanjose', 'swiss', 'valais', 'sanjose', 1857, 1857, 'Del Valais a San José', 'Unos 530 colonos del Valais, con familias de Saboya y del Piamonte, viajaban hacia Corrientes con un contrato que el gobierno provincial no cumplió. Recurrieron a Justo José de Urquiza, que los instaló en sus campos. La fundación se fecha el 2 de julio de 1857 y Alejo Peyret quedó a cargo de la administración. En el censo de 1869 el 14,7 % de la colonia había nacido en el Piamonte.', ['sanjose'], evidence='Contingente documentado', via=[[2, 44], [-7, 38], *atl[1:], [-58, -34]], date='Fundación: 02/07/1857. El puerto de embarque no se reconstruye.')
r('friuli-caroya', 'italian', 'friuli', 'caroya', 1878, 1878, 'Del Friuli a Colonia Caroya', 'Una ley de 1876 creó la colonia nacional en tierras de la antigua estancia jesuítica de Caroya, en Córdoba. Las familias friulanas llegaron en 1878 y se alojaron primero en la propia estancia. La historia local habla de 295 personas, cerca de cien familias, y da el 15 de marzo como fecha de llegada. Otras versiones sitúan el desembarco en Buenos Aires en enero y reparten el contingente entre Santa Fe, Chaco y Córdoba.', ['caroya', 'law'], evidence='Contingente documentado', stops=['ba'], via=[[8.9, 44.4], *med, [-58.38, -34.6]], date='Año de llegada: 1878. Día y recuento discutidos entre relatos.')
r('netherlands-tresarroyos', 'dutch', 'netherlands', 'tresarroyos', 1889, 1889, 'De Frisia a Tres Arroyos', 'En 1889 familias de Frisia y Groninga llegaron a Tres Arroyos con los pasajes que el Estado adelantaba ese año. La serie oficial registra 4.007 neerlandeses en 1889 y 395 en 1890. Parte del grupo regresó después de la crisis. Quienes quedaron formaron la comunidad neerlandesa más numerosa del país.', ['dutch', 'willcox', 'bunge'], evidence='Contingente documentado', via=[[2.5, 52], [-5, 49.5], [-12, 42], [-19, 25], [-28, 5], [-35, -10], [-43, -25], [-55, -36]], date='Año de llegada: 1889.')
r('sirio', 'italian', 'genoa', 'cabopalos', 1906, 1906, 'Sirio · el naufragio de 1906', 'El vapor Sirio salió de Génova el 2 de agosto de 1906 con emigrantes hacia Brasil, Uruguay y Argentina. El 4 de agosto encalló en los bajos de Cabo de Palos, en la costa de Murcia. Las fuentes difieren sobre las víctimas, entre unas 400 y 500 personas, porque el barco llevaba pasajeros sin registrar. Fue el mayor desastre de la emigración italiana al Plata y nunca llegó a destino.', ['sirio'], evidence='Viaje documentado', via=[[6.5, 42.6], [3.4, 41.2], [1.2, 39.4]], date='Salida: 02/08/1906. Naufragio: 04/08/1906. El viaje terminó frente a Cabo de Palos.')
r('asturias', 'spanish', 'barcelona', 'ilhabela', 1916, 1916, 'Príncipe de Asturias · 1916', 'El vapor español zarpó de Barcelona el 17 de febrero de 1916 hacia Buenos Aires con unas 600 personas. En la madrugada del 5 de marzo chocó contra los arrecifes frente a Ilhabela, en la costa de San Pablo. Las crónicas cuentan menos de 150 sobrevivientes. Viajaba en plena guerra, cuando las llegadas españolas a Argentina habían caído a 21.768 en el año.', ['asturias', 'willcox'], evidence='Viaje documentado', via=[[0, 38], [-5.7, 35.9], [-14, 28], [-25, 8], [-33, -7], [-40, -20]], date='Salida: 17/02/1916. Naufragio: 05/03/1916. El viaje terminó frente a Ilhabela.')
r('golondrinas', 'italian', 'ba', 'genoa', 1904, 1913, 'Golondrinas · cosecha y regreso', 'Bunge y García Mata describen una «inmigración flotante» de trabajadores europeos que llegaban entre octubre y diciembre, levantaban la cosecha y volvían en mayo o junio con sus ahorros. La estiman entre 50.000 y 70.000 personas por temporada, sobre todo entre 1907 y 1913, cuando la competencia entre navieras abarató el pasaje. Desapareció en 1914. Explica parte de las salidas: en 1913 se anotaron 156.829.', ['bunge', 'willcox'], layer='return', evidence='Corriente estacional', via=list(reversed(med)), date='Fenómeno concentrado entre 1907 y 1913 según Bunge y García Mata. La línea representa el regreso de otoño; no identifica un puerto exclusivo.')
r('ba-hinojo', 'volga', 'ba', 'hinojo', 1878, 1913, 'Buenos Aires → Azul → Hinojo', 'El primer grupo viajó en tren hasta Azul y recorrió en carretas de bueyes los últimos 35 kilómetros. La colonia Olavarría sumó después las aldeas de Nievas y San Miguel.', ['volgacenter'], 'interior', 'Conexión regional', via=[[-59.86, -36.78]])
r('ba-caroya', 'italian', 'ba', 'caroya', 1878, 1913, 'Buenos Aires → Colonia Caroya', 'Tras esperar en el Hotel de Inmigrantes, el grupo destinado a Córdoba viajó en tren a fines del verano de 1878.', ['caroya'], 'interior', 'Conexión regional')
r('ba-pigue', 'french', 'ba', 'pigüé', 1884, 1913, 'Buenos Aires → Pigüé', 'El Ferrocarril del Sud había llegado a la zona ese mismo año. Los colonos del Aveyron bajaron en una estación recién abierta.', ['pigue'], 'interior', 'Conexión regional')

UPDATES = {
    'genoa-ba': 'Génova fue el principal puerto de la emigración italiana al Río de la Plata. La estadística argentina anotó 2.604.029 entradas de italianos entre 1857 y 1924, sin distinguir puerto de embarque. El máximo anual fue 1906, con 127.348. En 1891, tras la crisis, entraron 15.511 y salieron 57.920. La línea representa la corriente y no el recorrido de un barco.',
    'vigo-ba': 'Vigo y A Coruña concentraron la salida gallega. Las entradas de españoles pasaron de 20.383 en 1900 a 165.662 en 1912, el máximo de la serie. Las cartas de llamada y la ayuda de parientes orientaban destino y primer empleo. La cifra es nacional y no se reparte entre puertos.',
    'ireland-ba': 'La cría ovina atrajo a familias de Westmeath, Longford y Wexford desde la década de 1840. De 6.447 irlandeses con puerto conocido, el 54 % embarcó en Liverpool y el 28 % en Queenstown. Las estimaciones del total van de 10.500 radicados a más de 40.000 emigrados con la mitad de reemigración.',
    'ba-genoa-return': 'Entre 1857 y 1924 se anotaron 1.292.789 salidas de italianos, casi la mitad de las entradas. En 1891 y entre 1914 y 1918 las salidas superaron a las llegadas. La estadística no dice quién volvía por haber cumplido su plan y quién por haber fracasado.',
    'ba-vigo-return': 'Se anotaron 756.262 salidas de españoles hasta 1924, el 42 % de las entradas. En 1914 salieron 77.646 y entraron 52.186. Parte de quienes volvían cruzó de nuevo más tarde, y cada cruce cuenta como un movimiento.',
    'mimosa': 'Unos 150 galeses zarparon de Liverpool el 28 de mayo de 1865 en el clíper Mimosa, al mando de George Pepperell. La mayoría venía de zonas mineras e industriales como Mountain Ash y Aberdare. Durante el viaje murieron cuatro niños y nacieron dos. Llegaron a Golfo Nuevo la noche del 26 de julio. El contrato de pasaje de Abraham Matthews consigna Liverpool–New Bay. El territorio tenía habitantes: los tehuelches comerciaron con la colonia desde el primer año.',
    'ba-rosario': 'Santa Fe fue el primer destino de los inmigrantes que el Estado trasladó al interior: 97.037 de 285.371 entre 1894 y 1903. Hubo circulación fluvial y ferroviaria, con muchos destinos intermedios.',
    'ba-mendoza': 'Mendoza recibió 17.454 inmigrantes internados por el Estado entre 1894 y 1903. La expansión vitivinícola atrajo trabajadores, técnicos y empresarios. No todos ingresaron por Buenos Aires.',
    'ba-cordoba': 'Córdoba fue el tercer destino del traslado estatal, con 28.498 personas entre 1894 y 1903. La inserción incluyó colonias del sudeste provincial, oficios urbanos y comercio.'}
UPSRC = {'genoa-ba': ['willcox'], 'vigo-ba': ['willcox'], 'ba-genoa-return': ['willcox'], 'ba-vigo-return': ['willcox'], 'ba-rosario': ['stlouis'], 'ba-mendoza': ['stlouis'], 'ba-cordoba': ['stlouis']}
for x in routes:
    if x['id'] in UPDATES: x['description'] = UPDATES[x['id']]
    for sid in UPSRC.get(x['id'], []):
        if sid not in x['sources']: x['sources'].append(sid)
    if x['id'] == 'ireland-ba': x['stops'] = ['queenstown', 'liverpool']; x['via'] = [[-8.29, 51.85], [-2.98, 53.408], [-6, 52], [-12, 42], [-19, 25], [-28, 5], [-35, -10], [-43, -25], [-52, -33]]; x['geometryNote'] = 'Los dos puertos marcados son los más frecuentes en los registros, no una escala sucesiva de un mismo viaje. Curva esquemática, sin escala de volumen.'
save('routes', routes)

# ----------------------------------------------------------------- épocas
eras = load('eras')
def span(a, b):
    rows = [x for x in series if a <= x['year'] <= b]
    return sum(x['immigrants'] for x in rows), sum(x['emigrants'] or 0 for x in rows if x['emigrants'] is not None), rows
ERA = {
    'early': dict(description='Comerciantes, artesanos, pastores y las primeras colonias agrícolas. Las llegadas anuales pasaron de 4.951 en 1857 a 48.382 en 1873, y cayeron con la crisis de 1875.',
                  events=['1853 · Constitución', '1856 · Esperanza', '1857 · San José y primera estadística', '1865 · Mimosa', '1871 · Fiebre amarilla', '1876 · Ley 817', '1878 · Hinojo y Caroya'], sources=['constitution', 'esperanza', 'mimosa', 'law', 'willcox']),
    'mass': dict(description='El ciclo de mayor intensidad. Hubo dos picos, 1889 con pasajes subsidiados y 1912 con el máximo de la serie, separados por la crisis de 1890, cuando salieron más personas de las que entraron.',
                 events=['1884 · Pigüé', '1889 · 218.744 llegadas y el Weser', '1891 · Saldo negativo', '1902 · Ley de Residencia', '1906 · Naufragio del Sirio', '1907 · Huelga de inquilinos', '1911 · Nuevo Hotel de Inmigrantes', '1912 · 323.403 llegadas'], sources=['subsidy', 'jewish', 'tenants', 'alcorta', 'willcox', 'bunge']),
    'war': dict(description='El saldo se volvió negativo antes de la guerra: entre abril y mayo de 1914 salían de 20.000 a 28.000 personas por mes. En 1918 llegaron 13.701, el mínimo desde 1866.',
                events=['1914 · Censo nacional', '1914 · 178.684 salidas', '1916 · Príncipe de Asturias', '1918 · Mínimo de llegadas'], sources=['census', 'devoto', 'willcox', 'bunge']),
    'twenties': dict(description='Las llegadas se recuperaron hasta 195.063 en 1923. Cambió la composición: polacos, alemanes, yugoslavos y checoslovacos pasaron del 13 % al 30 % del total entre la preguerra y 1926.',
                     events=['1919 · Semana Trágica', '1921 · Cuotas en Estados Unidos', '1923 · 195.063 llegadas', '1924 · Ley Johnson-Reed', '1929 · Crisis mundial'], sources=['policy', 'tragic', 'usquota', 'willcox', 'bunge']),
    'refuge': dict(description='Depresión, persecución y guerra. Desde 1938 se exigió permiso de desembarco y una circular secreta ordenó negar visas a los «indeseables o expulsados». Aun así entraron decenas de miles de refugiados, muchos de forma irregular.',
                   events=['1930 · Restricciones por la crisis', '1936–1939 · Guerra Civil española', '1938 · Conferencia de Evian y Circular 11', '1939 · Massilia', '1939–1945 · Segunda Guerra Mundial'], sources=['circular', 'exile', 'massilia', 'ushmm', 'circular11']),
    'postwar': dict(description='La última corriente masiva. Italia registró 346.153 salidas hacia Argentina entre 1946 y 1951 y 149.489 entre 1952 y 1959. Después la inmigración europea perdió peso frente a la de los países vecinos.',
                    events=['1947 · Censo y primer acuerdo con Italia', '1948 · Segundo acuerdo con Italia', '1951 · Creación del CIME', '1958 · Derogación de la Ley de Residencia', '1960 · 13 % de extranjeros'], sources=['postwar', 'population', 'scarzanella', 'modolo'])}
for e in eras:
    e.update(ERA[e['id']])
    a, b = max(e['start'], 1857), min(e['end'], 1924)
    figs = []
    if a <= b:
        i, o, rows = span(a, b)
        figs.append(dict(value=i, label=f'entradas de ultramar, {a}–{b}'))
        if a >= 1871:
            figs.append(dict(value=o, label=f'salidas, {a}–{b}'))
            figs.append(dict(value=i - o, label='saldo del período'))
        top = max(rows, key=lambda x: x['immigrants'])
        figs.append(dict(value=top['immigrants'], label=f'máximo anual, en {top["year"]}'))
    e['figures'] = figs
    e['figuresNote'] = 'Serie oficial de segunda y tercera clase por vía marítima, disponible para 1857–1924.' if figs else 'La serie anual homogénea de este atlas termina en 1924. Para estos años se citan cifras parciales en la investigación.'
by = {e['id']: e for e in eras}
by['refuge']['figures'] = [dict(value=24000, label='refugiados judíos admitidos oficialmente, 1933–1943'), dict(value=20000, label='ingresos irregulares estimados, 1933–1943')]
by['refuge']['figuresNote'] = 'Estimaciones del United States Holocaust Memorial Museum.'
by['postwar']['figures'] = [dict(value=346153, label='salidas de Italia hacia Argentina, 1946–1951'), dict(value=149489, label='salidas de Italia hacia Argentina, 1952–1959'), dict(value=88209, label='traslados financiados por el CIME, 1952–1959')]
by['postwar']['figuresNote'] = 'Datos ISTAT citados por Scarzanella (2018). Son salidas desde Italia, no saldos.'
save('eras', eras)

# ------------------------------------------------------------- cronología
T = []
def t(year, title, text, src, kind='política'): T.append(dict(year=year, title=title, text=text, sources=src, kind=kind))
t(1853, 'Constitución nacional', 'El artículo 20 reconoce a los extranjeros los derechos civiles del ciudadano. El artículo 25 ordena fomentar la inmigración europea.', ['constitution'])
t(1856, 'Esperanza', 'Familias suizas, alemanas y francesas inician en Santa Fe una colonia agrícola organizada por contrato.', ['esperanza'], 'colonia')
t(1857, 'Primera estadística y colonia San José', 'La Comisión Filantrópica de Inmigración empieza a contar pasajeros: 4.951 en el año. Unos 530 colonos del Valais, Saboya y Piamonte se instalan en campos de Urquiza.', ['bunge', 'sanjose'], 'colonia')
t(1865, 'El Mimosa llega a Golfo Nuevo', 'Unos 150 galeses desembarcan en Patagonia a fines de julio.', ['mimosa'], 'viaje')
t(1869, 'Primer censo nacional', '210.295 extranjeros, el 12,1 % de la población. La Comisión Central de Inmigración reemplaza a la sociedad filantrópica.', ['census', 'bunge'], 'dato')
t(1871, 'Fiebre amarilla', 'La epidemia en Buenos Aires reduce las llegadas a la mitad: 15.088 frente a 30.898 del año anterior.', ['bunge', 'willcox'], 'crisis')
t(1873, 'Primer pico', '48.382 llegadas. Las colonias de Santa Fe y Entre Ríos crecen y empieza la exportación de trigo.', ['bunge', 'willcox'], 'dato')
t(1876, 'Ley 817 de Inmigración y Colonización', 'Define al inmigrante como todo extranjero menor de sesenta años que llega en segunda o tercera clase para establecerse. Ofrece alojamiento, colocación y traslado gratuitos.', ['law', 'stlouis'])
t(1878, 'Alemanes del Volga y friulanos', 'El 5 de enero se funda Hinojo. En julio se establecen las aldeas de Entre Ríos. Familias friulanas llegan a Colonia Caroya.', ['volgacenter', 'caroya'], 'colonia')
t(1884, 'Pigüé', 'Unas cuarenta familias del Aveyron llegan a la estación el 3 de diciembre.', ['pigue'], 'colonia')
t(1888, 'Pasajes subsidiados', 'El Estado adelanta pasajes: 12.000 personas en 1888, 100.000 en 1889 y 20.000 en 1890, según Bunge y García Mata.', ['bunge', 'subsidy'])
t(1889, 'El año de las 218.744 llegadas', 'Récord del siglo XIX. Llegan 71.151 españoles, 27.173 franceses, 8.666 belgas y 4.007 neerlandeses. El 14 de agosto ancla el Weser.', ['willcox', 'sinay'], 'dato')
t(1890, 'Crisis financiera', 'Caen las llegadas a 77.815 y se abandona el sistema de pasajes subsidiados.', ['bunge', 'subsidy'], 'crisis')
t(1891, 'Saldo negativo', 'Entran 28.266 personas y salen 72.380. Entre los italianos, 15.511 entradas y 57.920 salidas.', ['willcox'], 'crisis')
t(1895, 'Segundo censo nacional', '1.004.527 extranjeros, el 25,4 % de la población.', ['census'], 'dato')
t(1897, 'Apóstoles', 'Un contingente polaco y ucraniano de Galitzia llega a Misiones el 27 de agosto.', ['apostoles'], 'colonia')
t(1902, 'Ley de Residencia', 'La ley 4.144 permite al Poder Ejecutivo expulsar extranjeros sin juicio. Entre 1902 y 1914 los decretos alcanzaron a 560 personas.', ['alvarez'])
t(1906, 'Naufragio del Sirio', 'El vapor encalla en Cabo de Palos el 4 de agosto. Ese año se registran 127.348 entradas de italianos, el máximo.', ['sirio', 'willcox'], 'viaje')
t(1907, 'Huelga de inquilinos', 'Los conventillos de Buenos Aires y Rosario dejan de pagar el alquiler. Empieza el auge de la inmigración golondrina.', ['tenants', 'bunge'], 'conflicto')
t(1910, 'Ley de Defensa Social', 'La ley 7.029 prohíbe el ingreso de anarquistas y restringe reuniones y prensa.', ['defense'])
t(1911, 'Nuevo Hotel de Inmigrantes', 'Edificio de hormigón con cuatro dormitorios por piso, cada uno para 250 personas. Alojamiento gratuito por cinco días.', ['hotel'], 'institución')
t(1912, 'Máximo histórico y Grito de Alcorta', '323.403 llegadas en el año, 165.662 de españoles. En junio los arrendatarios del sur de Santa Fe van a la huelga.', ['willcox', 'alcorta'], 'dato')
t(1914, 'Censo y reflujo', '2.357.952 extranjeros, el 29,9 %. En el año entran 115.321 personas y salen 178.684. El reflujo empezó antes de la guerra.', ['census', 'bunge', 'willcox'], 'dato')
t(1916, 'Príncipe de Asturias', 'El vapor español se hunde frente a Ilhabela el 5 de marzo, en viaje de Barcelona a Buenos Aires.', ['asturias'], 'viaje')
t(1918, 'Mínimo de la serie', '13.701 llegadas. El movimiento total, entradas más salidas, es de unas 38.000 personas.', ['willcox', 'bunge'], 'crisis')
t(1919, 'Semana Trágica', 'Represión obrera en Buenos Aires, con ataques contra el barrio judío.', ['tragic'], 'conflicto')
t(1923, 'Recuperación', '195.063 llegadas, el nivel de preguerra. Un nuevo reglamento exige certificados visados por el cónsul argentino.', ['willcox', 'bunge', 'devoto'], 'dato')
t(1924, 'Cuotas en Estados Unidos', 'La ley Johnson-Reed cierra el principal destino para europeos del sur y del este.', ['usquota'])
t(1926, 'Quiénes llegaban', 'De 135.011 pasajeros de segunda y tercera clase, 113.352 declararon intención de quedarse y 18.036 ya habían estado en el país.', ['bunge'], 'dato')
t(1930, 'Crisis y restricciones', 'La depresión reduce las llegadas y el Estado endurece los requisitos consulares.', ['devoto', 'policy'], 'crisis')
t(1938, 'Evian y la Circular 11', 'El 12 de julio el canciller José María Cantilo ordena en secreto negar visas a quienes abandonan su país «como indeseables o expulsados».', ['circular', 'circular11'])
t(1939, 'Massilia', 'El vapor sale de La Rochelle el 19 de octubre con exiliados republicanos y llega a Buenos Aires el 5 de noviembre.', ['massilia'], 'viaje')
t(1947, 'Cuarto censo y acuerdo con Italia', '2.435.927 extranjeros, el 15,3 %. Argentina e Italia firman el primero de dos acuerdos de emigración.', ['census', 'scarzanella'], 'dato')
t(1951, 'CIME', 'Se crea el Comité Intergubernamental para las Migraciones Europeas. Entre 1952 y 1959 financió 88.209 traslados de italianos a Argentina.', ['scarzanella'], 'institución')
t(1958, 'Derogación de la Ley de Residencia', 'El Congreso anula la ley 4.144 después de 56 años.', ['alvarez'])
t(1960, 'Quinto censo', '2.604.447 nacidos en el exterior, el 13 % de la población. El 17,9 % de ellos nació en un país limítrofe.', ['modolo'], 'dato')
save('timeline', sorted(T, key=lambda x: x['year']))
print('deepen-data: ok', len(sources), 'fuentes,', len(routes), 'rutas,', len(places), 'lugares,', len(T), 'hitos')
