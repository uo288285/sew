# xml2html.py
import xml.etree.ElementTree as ET

class Html:
    """Genera HTML básico desde Python"""

    def __init__(self):
        self.lineas = []

    def cabecera(self, titulo):
        self.lineas.append('<!DOCTYPE html>')
        self.lineas.append('<html lang="es">') 
        self.lineas.append('<head>')
        self.lineas.append('  <meta charset="UTF-8">')
        self.lineas.append('  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
        self.lineas.append(f'  <title>{titulo}</title>')
        self.lineas.append('  <link rel="stylesheet" type="text/css" href="../estilo/estilo.css">')
        self.lineas.append('</head>')
        self.lineas.append('<body>')
        self.lineas.append(f'<h1>{titulo}</h1>')

    def tituloh2(self, titulo):
        self.lineas.append(f'<h2>{titulo}</h2>')

    def parrafo(self, texto):
        self.lineas.append(f'<p>{texto}</p>')

    def lista(self, elementos):
        self.lineas.append('<ul>')
        for e in elementos:
            self.lineas.append(f'  <li>{e}</li>')
        self.lineas.append('</ul>')

    def imagen(self, src, alt="Imagen"):
        self.lineas.append(f'<img src="{src}" alt="{alt}">')

    def videoMp4(self, src):
        self.lineas.append(
            f'<video controls>'
            f'<source src="{src}" type="video/mp4">'
            f'</video>'
        )

    def enlace(self, href):
        self.lineas.append(f'<a href="{href}">{href}</a>')

    def cerrar(self):
        self.lineas.append('</body>')
        self.lineas.append('</html>')

    def guardar(self, nombre):
        with open(nombre, 'w', encoding='utf-8') as f:
            for l in self.lineas:
                f.write(l + '\n')
        print(f'Archivo HTML generado: {nombre}')


def generar_html(xml_in, html_out):
    ns = {'u': 'http://www.uniovi.es'}
    tree = ET.parse(xml_in)
    root = tree.getroot()

    nombre = root.find('.//u:nombre', ns).text.strip()

    html = Html()
    html.cabecera(nombre)

    
    
    html.tituloh2('Datos generales')

    fecha = root.find(f'.//u:fecha', ns)
    html.parrafo(f'La carrera este año sucedió el  {fecha.text.strip()}.')   

    hora = root.find(f'.//u:hora', ns)
    html.parrafo(f'La salida fue a las {hora.text.strip()}  (hora local).') 

    vueltas = root.find(f'.//u:vueltas', ns)
    html.parrafo(f'Se dieron un total de vueltas de {vueltas.text.strip()}.') 
    
    lProxima = root.find(f'.//u:localidadProxima', ns)
    html.parrafo(f'La localidad más próxima al circuito es {lProxima.text.strip()}.') 

    pais = root.find(f'.//u:pais', ns)
    html.parrafo(f'El circuito está en {pais.text.strip()}.')

    patrocinador = root.find(f'.//u:patrocinador', ns)
    html.parrafo(f'El patrocinador es {patrocinador.text.strip()}.')

    ganador = root.find(f'.//u:ganador', ns)
    html.parrafo(f'El ganador ha sido {ganador.text.strip()}.')

    tiempoGanador = root.find(f'.//u:tiempoGanador', ns)
    dur = tiempoGanador.text.strip()
    dur = dur.replace("PT", "")
    dur = dur.replace("H", " h ")
    dur = dur.replace("M", " min ")
    dur = dur.replace("S", " s ")

    html.parrafo(f'Tiempo ganador fue de: {dur}.')

    

    longitudCircuito = root.find(f'.//u:longitudCircuito', ns)
    unidades = longitudCircuito.get('unidades')
    html.parrafo(f'La longitud del circuito es de : {longitudCircuito.text.strip()} {unidades}')

    anchuraCircuito = root.find(f'.//u:anchuraCircuito', ns)
    unidades = anchuraCircuito.get('unidades')
    html.parrafo(f'La anchuraCircuito del circuito es de : {anchuraCircuito.text.strip()} {unidades}')


    
    clasif = root.findall('.//u:clasificación/u:piloto', ns)
    if clasif:
        html.tituloh2('Clasificación tras la carrera')
        lista_clasif = []
        for p in clasif:
            puesto = p.get('puesto')
            nombre_p = p.text
            lista_clasif.append(f'{puesto}. {nombre_p}')
            
        html.lista(lista_clasif)

   
    fotos = root.findall('.//u:galeriaFoto/u:foto', ns)
    if fotos:
        html.tituloh2('Galería de fotos')
        for f in fotos:
            fuente = f.get('fuente')
            alt = f.get('descripcion')
            html.imagen(f"multimedia/{fuente}", alt)

    
    videos = root.findall('.//u:galeriaVideo/u:video', ns)
    if videos:
        html.tituloh2('Galería de vídeos')
        for v in videos:
            fuente = v.get('fuente')
            html.videoMp4(f"multimedia/{fuente}")

    

    refs = root.findall('.//u:referencias/u:referencia', ns)
    if refs:
        html.tituloh2('Referencias')
        for r in refs:
            url =r.text
            html.enlace(url)

    html.cerrar()
    html.guardar(html_out)


if __name__ == "__main__":
    generar_html('circuitoEsquema.xml', 'InfoCircuito.html')
