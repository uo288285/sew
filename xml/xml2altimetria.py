import xml.etree.ElementTree as ET


class Svg(object):
    """Genera archivos SVG con figuras básicas."""

    def __init__(self):
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", version="2.0")

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

    # --- 1. Cargar XML ---
    tree = ET.parse("circuitoEsquema.xml")
    root = tree.getroot()

    ns = {'u': 'http://www.uniovi.es'}

    # --- 2. Extraer origen ---
    alt0 = float(root.find('.//u:origen/u:coordenadas/u:altitud', ns).text)

    # --- 3. Extraer distancias y altitudes ---
    puntos = root.findall('.//u:puntosAnonimos', ns)

    distancias = []
    altitudes = []
    distanciaAcumulada = 0

    for punto in puntos:

        tramo = float(punto.find('u:tramo', ns).text)
        distanciaAcumulada += tramo
        distancias.append(distanciaAcumulada)

        alt = float(punto.find('u:coordenadas/u:altitud', ns).text)
        altitudes.append(alt)



    # --- 4. Configuración SVG ---
    anchoSVG = 1200
    altoSVG = 400
    margenX = 100
    margenY = 50

    maxDist = distancias[-1]
    maxAlt = max(altitudes + [alt0])
    minAlt = 0

    escalaX = (anchoSVG - 2*margenX) / maxDist
    escalaY = (altoSVG - 2*margenY) / (maxAlt - minAlt)

    svg = Svg()

    # --- 5. Mensaje superior ---
    svg.addText("Gráfica de Longitud/Altitud (m)", str(anchoSVG//2 - 100), "30", "Verdana", "16", "fill:black; font-weight:bold")

    # --- 6. Dibujar ejes ---
    svg.addLine(str(margenX), str(altoSVG-margenY), str(anchoSVG-margenX), str(altoSVG-margenY), "black", "2")  # eje X
    svg.addLine(str(margenX), str(margenY), str(margenX), str(altoSVG-margenY), "black", "2")  # eje Y

    # --- 7. Marcas eje X cada 500 metros + valor máximo ---
    marcaX = 500
    x_actual = 0
    while x_actual <= maxDist-500:
        x = margenX + x_actual * escalaX
        y1 = altoSVG - margenY
        y2 = y1 + 5
        svg.addLine(str(x), str(y1), str(x), str(y2), "black", "1")
        # valor de la marca
        svg.addText(f"{int(x_actual)}", str(x-15), str(y2+15), "Verdana", "12", "fill:black")
        x_actual += marcaX

    # asegurar que se marca también el valor máximo
    if x_actual - marcaX < maxDist:
        x = margenX + maxDist * escalaX
        y1 = altoSVG - margenY
        y2 = y1 + 5
        svg.addLine(str(x), str(y1), str(x), str(y2), "black", "1")
        svg.addText(f"{int(maxDist)}", str(x-20), str(y2+15), "Verdana", "12", "fill:black")

    # --- 8. Marcas eje Y cada 5 metros ---
    marcaY = 5
    y_actual = 0
    while y_actual <= maxAlt:
        y = (altoSVG - margenY) - (y_actual - minAlt) * escalaY
        x1 = margenX - 5
        x2 = margenX
        svg.addLine(str(x1), str(y), str(x2), str(y), "black", "1")
        # valor de la marca
        svg.addText(f"{int(y_actual)}", str(x1-35), str(y+5), "Verdana", "12", "fill:black")
        y_actual += marcaY

    # --- 9. Crear polilínea de altimetría ---
    puntos_svg = ""
    # primer punto: origen
    x0 = margenX
    y0 = (altoSVG - margenY) - (alt0 - minAlt) * escalaY
    puntos_svg += f"{x0},{y0} "

    # resto de puntos
    for dist, alt in zip(distancias, altitudes):
        x = margenX + dist * escalaX
        y = (altoSVG - margenY) - (alt - minAlt) * escalaY
        puntos_svg += f"{x},{y} "

    # Cerrar polilínea para rellenar suelo
    puntos_svg += f"{anchoSVG-margenX},{altoSVG-margenY} {margenX},{altoSVG-margenY}"

    svg.addPolyline(points=puntos_svg, stroke="red", strokeWidth="2", fill="lightblue")

    # --- 10. Guardar SVG ---
    svg.escribir("altimetria.svg")
    print("Archivo generado: altimetria.svg")



if __name__ == "__main__":
    main()
