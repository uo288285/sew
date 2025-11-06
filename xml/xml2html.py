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
        self.lineas.append('  <link rel="stylesheet" href="../estilo/estilo.css">')
        self.lineas.append('</head>')
        self.lineas.append('<body>')
        self.lineas.append(f'<h1>{titulo}</h1>')

    def seccion(self, titulo):
        self.lineas.append(f'<h2>{titulo}</h2>')

    def parrafo(self, texto):
        self.lineas.append(f'<p>{texto}</p>')

    def lista(self, elementos):
        self.lineas.append('<ul>')
        for e in elementos:
            self.lineas.append(f'  <li>{e}</li>')
        self.lineas.append('</ul>')

    def tabla(self, cabeceras, filas):
        self.lineas.append('<table border="1">')
        self.lineas.append('<thead><tr>')
        for c in cabeceras:
            self.lineas.append(f'<th>{c}</th>')
        self.lineas.append('</tr></thead>')
        self.lineas.append('<tbody>')
        for fila in filas:
            self.lineas.append('<tr>')
            for celda in fila:
                self.lineas.append(f'<td>{celda}</td>')
            self.lineas.append('</tr>')
        self.lineas.append('</tbody></table>')

    def cerrar(self):
        self.lineas.append('</body>')
        self.lineas.append('</html>')

    def guardar(self, nombre):
        with open(nombre, 'w', encoding='utf-8') as f:
            for l in self.lineas:
                f.write(l + '\n')
        print(f'✅ Archivo HTML generado: {nombre}')


def generar_html(xml_in, html_out):
    ns = {'u': 'http://www.uniovi.es'}
    tree = ET.parse(xml_in)
    root = tree.getroot()

    # Extraer nombre del circuito
    nombre = root.find('u:nombre', ns).text.strip()

    html = Html()
    html.cabecera(nombre)

    # --- Datos generales ---
    html.seccion('Datos generales')
    campos = ['longitud', 'anchura', 'fecha', 'hora', 'vueltas', 'localidadProxima', 'pais', 'patrocinador', 'tiempoGanador']
    for c in campos:
        nodo = root.find(f'u:{c}', ns)
        if nodo is not None and nodo.text:
            val = nodo.text.strip()
            if 'unidades' in nodo.attrib:
                val += f' ({nodo.attrib["unidades"]})'
            html.parrafo(f'<strong>{c.capitalize()}:</strong> {val}')

    # --- Referencias ---
    refs = root.findall('.//u:referencias/u:referencia', ns)
    if refs:
        html.seccion('Referencias')
        lista_refs = [r.text.strip() for r in refs if r.text]
        html.lista(lista_refs)

    # --- Galería de fotos ---
    fotos = root.findall('.//u:galeriaFoto/u:foto', ns)
    if fotos:
        html.seccion('Galería de fotos')
        for f in fotos:
            fuente = f.get('fuente')
            if fuente:
                html.parrafo(f'<img src="{fuente}" alt="Foto del circuito" style="max-width:100%;">')

    # --- Galería de vídeos ---
    videos = root.findall('.//u:galeriaVideo/u:video', ns)
    if videos:
        html.seccion('Galería de vídeos')
        for v in videos:
            fuente = v.get('fuente')
            if fuente:
                html.parrafo(f'<video controls width="400"><source src="{fuente}" type="video/mp4"></video>')

    # --- Clasificación ---
    clasif = root.findall('.//u:clasificación/u:piloto', ns)
    if clasif:
        html.seccion('Clasificación')
        filas = []
        for p in clasif:
            puesto = p.get('puesto')
            nombre_p = (p.text or '').strip()
            filas.append([puesto, nombre_p])
        html.tabla(['Puesto', 'Piloto'], filas)

    html.cerrar()
    html.guardar(html_out)


if __name__ == "__main__":
    generar_html('circuitoEsquema.xml', 'InfoCircuito.html')
