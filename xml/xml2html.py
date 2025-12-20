# xml2html.py
import xml.etree.ElementTree as ET

class Html:
    """Genera HTML básico desde Python"""

    def __init__(self):
        self.lineas = []

    def cabecera(self, titulo):
        """
        Genera la estructura básica del documento HTML (DOCTYPE, head, body inicial).
        """
        self.lineas.append('<!DOCTYPE html>')
        self.lineas.append('<html lang="es">') 
        self.lineas.append('<head>')
        self.lineas.append('  <meta charset="UTF-8">')
        self.lineas.append(f'  <title>{titulo}</title>')
        self.lineas.append('  <meta name="viewport" content="width=device-width, initial-scale=1.0">')
        self.lineas.append('  <meta name="author" content="Miguel Arias Guerrero" />')
        self.lineas.append('  <meta name="description" content="Información general sobre el circuito de Sepang" />')
        self.lineas.append('  <meta name="keywords" content="MotoGP, circuito, Sepang" />')
        self.lineas.append('  <link rel="stylesheet" type="text/css" href="../estilo/estilo.css">')
        self.lineas.append('  <link rel="icon" href="../multimedia/favicon.ico" />')
        self.lineas.append('</head>')
        self.lineas.append('<body>')
        self.lineas.append(f'<h1>{titulo}</h1>')   

    def tituloh2(self, titulo):
        """
        Añade un encabezado de nivel 2.
        """
        self.lineas.append(f'<h2>{titulo}</h2>')

    def parrafo(self, texto):
        """
        Añade un párrafo de texto.
        """
        self.lineas.append(f'<p>{texto}</p>')

    def imagen(self, src, alt="Imagen"):
        """
        Añade una imagen.
        """
        self.lineas.append(f'<img src="{src}" alt="{alt}">')

    def videoMp4(self, src):
        """
        Añade un elemento de vídeo HTML5 con controles.
        """
        self.lineas.append(
            f'<video controls>'
            f'<source src="{src}" type="video/mp4">'
            f'</video>'
        )

    def enlace(self, href):
        """
        Añade un enlace donde el texto visible es la propia URL.
        """
        self.lineas.append(f'<a href="{href}">{href}</a>')

    def cerrar(self):
        """Cierra las etiquetas body y html del documento"""
        self.lineas.append('</body>')
        self.lineas.append('</html>')

    def guardar(self, nombre):
        """
        Guarda el HTML generado en un archivo.
        """
        with open(nombre, 'w', encoding='utf-8') as f:
            for l in self.lineas:
                f.write(l + '\n')
        print(f'Archivo HTML generado: {nombre}')


def generar_html(xml_in, html_out):
    """
    Convierte un archivo XML del circuito a un documento HTML.
    """
    # Definir namespace para búsquedas XPath
    ns = {'u': 'http://www.uniovi.es'}
    tree = ET.parse(xml_in)
    root = tree.getroot()

    

    html = Html()
    html.cabecera("InfoCircuito")

    # Extraer y mostrar datos generales del circuito
    nombre = root.find('.//u:nombre', ns).text.strip()
    html.tituloh2(f'Datos generales de {nombre}')

    fecha = root.find(f'.//u:fecha', ns)
    html.parrafo(f'La carrera este año sucedió el  {fecha.text.strip()}.')   

    hora = root.find(f'.//u:hora', ns)
    html.parrafo(f'La salida fue a las {hora.text.strip()}  (hora en España).') 

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

    # Procesar y formatear la duración del tiempo ganador
    tiempoGanador = root.find(f'.//u:tiempoGanador', ns)
    dur = tiempoGanador.text.strip()
    dur = dur.replace("PT", "")
    dur = dur.replace("H", " h ")
    dur = dur.replace("M", " min ")
    dur = dur.replace("S", " s ")

    html.parrafo(f'El tiempo del ganador fue de: {dur}.')

    
    # Mostrar dimensiones del circuito con unidades
    longitudCircuito = root.find(f'.//u:longitudCircuito', ns)
    unidades = longitudCircuito.get('unidades')
    html.parrafo(f'La longitud del circuito es de: {longitudCircuito.text.strip()} {unidades}')

    anchuraCircuito = root.find(f'.//u:anchuraCircuito', ns)
    unidades = anchuraCircuito.get('unidades')
    html.parrafo(f'La anchura del circuito es de: {anchuraCircuito.text.strip()} {unidades}')


    # Mostrar clasificación de pilotos
    clasif = root.findall('.//u:clasificación/u:piloto', ns)
    if clasif:
        html.tituloh2('Clasificación tras la carrera')
        for p in clasif:
            puesto = p.get('puesto')
            nombre_p = p.text
            html.parrafo(f'{puesto}. {nombre_p}')

    # Mostrar galería de fotos
    fotos = root.findall('.//u:galeriaFoto/u:foto', ns)
    if fotos:
        html.tituloh2('Galería de fotos')
        for f in fotos:
            fuente = f.get('fuente')
            alt = f.get('descripcion')
            html.imagen(f"multimedia/{fuente}", alt)

    # Mostrar galería de vídeos
    videos = root.findall('.//u:galeriaVideo/u:video', ns)
    if videos:
        html.tituloh2('Galería de vídeos')
        for v in videos:
            fuente = v.get('fuente')
            html.videoMp4(f"multimedia/{fuente}")

    
    # Mostrar referencias externas
    refs = root.findall('.//u:referencias/u:referencia', ns)
    if refs:
        html.tituloh2('Referencias')
        for r in refs:
            url =r.text
            html.enlace(url)

    # Cerrar y guardar el documento HTML
    html.cerrar()
    html.guardar(html_out)


if __name__ == "__main__":
    generar_html('circuitoEsquema.xml', 'InfoCircuito.html')
