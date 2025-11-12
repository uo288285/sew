# -*- coding: utf-8 -*-
"""
Lee el archivo 'circuitoEsquema.xml' y genera 'altimetria.svg'
dibujando una polilínea con ejes, etiquetas y referencia desde el origen (0,0).

@version 1.2 18/Octubre/2025
"""

import xml.etree.ElementTree as ET


class Svg(object):
    """Genera archivos SVG con figuras básicas."""

    def __init__(self):
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", version="1.1")

    def addPolyline(self, points, stroke, strokeWidth, fill):
        ET.SubElement(
            self.raiz,
            'polyline',
            points=points,
            **{'stroke': stroke, 'stroke-width': strokeWidth, 'fill': fill},
        )

    def addRect(self, x, y, width, height, fill, strokeWidth, stroke):
        ET.SubElement(
            self.raiz,
            'rect',
            x=x,
            y=y,
            width=width,
            height=height,
            fill=fill,
            **{'stroke-width': strokeWidth, 'stroke': stroke},
        )

    def addLine(self, x1, y1, x2, y2, stroke, strokeWidth):
        ET.SubElement(
            self.raiz,
            'line',
            x1=x1,
            y1=y1,
            x2=x2,
            y2=y2,
            **{'stroke': stroke, 'stroke-width': strokeWidth},
        )

    def addText(self, texto, x, y, fontFamily, fontSize, style):
        ET.SubElement(
            self.raiz,
            'text',
            x=x,
            y=y,
            **{'font-family': fontFamily, 'font-size': fontSize, 'style': style},
        ).text = texto

    def escribir(self, nombreArchivoSVG):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)


def main():
    # 1️⃣ Leer el XML con namespace
    nombreXML = "circuitoEsquema.xml"
    ns = {'u': 'http://www.uniovi.es'}
    arbol = ET.parse(nombreXML)
    raiz = arbol.getroot()

    # 2️⃣ Extraer tramos y altitudes con XPath
    tramos = [float(t.text.strip()) for t in raiz.findall('.//u:puntosAnonimos/u:tramo', ns)]
    altitudes = [float(a.text.strip()) for a in raiz.findall('.//u:puntosAnonimos/u:coordenadas/u:altitud', ns)]

    # 3️⃣ Calcular distancias acumuladas
    distancias = []
    acumulada = 0
    for t in tramos:
        acumulada += t
        distancias.append(acumulada)

    # 4️⃣ Escalado y márgenes
    escala_x = 0.1  # metros → píxeles
    escala_y = 5
    margen = 60
    max_alt = max(altitudes)
    ancho_svg = int(distancias[-1] * escala_x + margen * 2)
    alto_svg = int((max_alt + 10) * escala_y + margen * 2)

    # 5️⃣ Construir puntos de la polilínea (desde 0,0)
    puntos = []
    x0 = margen
    y0 = alto_svg - margen
    puntos.append(f"{x0},{y0}")  # origen (0,0)

    for d, a in zip(distancias, altitudes):
        x = d * escala_x + margen
        y = alto_svg - (a * escala_y + margen)
        puntos.append(f"{x},{y}")

    # 6️⃣ Crear el SVG
    nombreSVG = "altimetria.svg"
    svg = Svg()

    # Fondo blanco
    svg.addRect('0', '0', str(ancho_svg), str(alto_svg), 'white', '1', 'black')

    # Ejes X e Y
    svg.addLine(str(margen), str(margen),
                str(margen), str(alto_svg - margen),
                'black', '1')
    svg.addLine(str(margen), str(alto_svg - margen),
                str(ancho_svg - margen), str(alto_svg - margen),
                'black', '1')

    # Polilínea roja
    svg.addPolyline(" ".join(puntos), 'red', '2', 'none')

    # Escalas
    paso_x = int(distancias[-1] / 5)
    for i in range(0, 6):
        x = margen + i * paso_x * escala_x
        svg.addLine(str(x), str(alto_svg - margen), str(x), str(alto_svg - margen + 5), 'black', '1')
        svg.addText(f"{i * paso_x:.0f}", str(x - 10), str(alto_svg - margen + 20), 'Verdana', '12', 'none')

    paso_y = 10
    for a in range(0, int(max_alt) + paso_y, paso_y):
        y = alto_svg - (a * escala_y + margen)
        svg.addLine(str(margen - 5), str(y), str(margen), str(y), 'black', '1')
        svg.addText(f"{a}", str(margen - 35), str(y + 5), 'Verdana', '12', 'none')

    # ➕ Etiquetas de ejes
    svg.addText("Distancia (m)", str(ancho_svg / 2 - 40), str(alto_svg - margen + 45),
                'Verdana', '14', 'font-weight:bold')
    svg.addText("Altitud (m)", str(margen - 55), str(margen - 15),
                'Verdana', '14', 'font-weight:bold')

    # 7️⃣ Guardar SVG
    svg.escribir(nombreSVG)
    print(f"✅ Archivo generado: {nombreSVG}")


if __name__ == "__main__":
    main()
