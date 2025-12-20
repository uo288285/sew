# xml2altimetria.py
import xml.etree.ElementTree as ET


class Svg(object):
    """Genera archivos SVG con figuras básicas."""

    def __init__(self):
        """
        Crea el elemento raíz, el espacio de nombres y la versión
        """
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", version="2.0")

    def addPolyline(self, points, stroke, strokeWidth, fill):
        """
        Añade un elemento polyline
        """
        ET.SubElement(
            self.raiz,
            'polyline',
            points=points,
            #Uso de diccionario (**) para pasar atributos con guiones
            **{'stroke': stroke, 'stroke-width': strokeWidth, 'fill': fill},
        )

    

    def addLine(self, x1, y1, x2, y2, stroke, strokeWidth):
        """
        Añade un elemento line
        """
        ET.SubElement(
            self.raiz,
            'line',
            x1=x1,
            y1=y1,
            x2=x2,
            y2=y2,
            #Uso de diccionario (**) para pasar atributos con guiones
            **{'stroke': stroke, 'stroke-width': strokeWidth},
        )

    def addText(self, texto, x, y, fontFamily, fontSize, style):
        """
        Añade un elemento texto
        """
        ET.SubElement(
            self.raiz,
            'text',
            x=x,
            y=y,
            #Uso de diccionario (**) para pasar atributos con guiones
            **{'font-family': fontFamily, 'font-size': fontSize, 'style': style},
        ).text = texto

    def escribir(self, nombreArchivoSVG):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)

def main():

    tree = ET.parse("circuitoEsquema.xml")
    root = tree.getroot()

    # Definir namespace para búsquedas XPath
    ns = {'u': 'http://www.uniovi.es'}

    # Obtener altitud inicial del punto de origen
    alt0 = float(root.find('.//u:origen/u:coordenadas/u:altitud', ns).text)

    # Buscar todos los puntos anónimos del circuito
    puntos = root.findall('.//u:puntosAnonimos', ns)

    
    distancias = []
    altitudes = []
    distanciaAcumulada = 0

    # Recorrer cada punto y acumular distancias y altitudes
    for punto in puntos:
        # Extraer la distancia del tramo y acumularla
        tramo = float(punto.find('u:tramo', ns).text)
        distanciaAcumulada += tramo
        distancias.append(distanciaAcumulada)

        # Extraer altitud del punto
        alt = float(punto.find('u:coordenadas/u:altitud', ns).text)
        altitudes.append(alt)

    # Definir dimensiones del SVG y márgenes
    anchoSVG = 1200
    altoSVG = 400
    margenX = 100
    margenY = 50

    # Calcular valores máximos y mínimos para el escalado
    maxDist = distancias[-1]
    maxAlt = max(altitudes + [alt0])
    minAlt = 0

    # Calcular factores de escala para ajustar los datos al lienzo SVG
    escalaX = (anchoSVG - 2*margenX) / maxDist
    escalaY = (altoSVG - 2*margenY) / (maxAlt - minAlt)

    # Crear objeto SVG
    svg = Svg()

    # Añadir título de la gráfica
    svg.addText("Gráfica de Longitud/Altitud (m)", str(anchoSVG//2 - 100), "30", "Verdana", "16", "fill:#ffd700; font-weight:bold")

    # Dibujar ejes X e Y
    svg.addLine(str(margenX), str(altoSVG-margenY), str(anchoSVG-margenX), str(altoSVG-margenY), "#ffd700", "2")  # eje X
    svg.addLine(str(margenX), str(margenY), str(margenX), str(altoSVG-margenY), "#ffd700", "2")  # eje Y

    # Dibujar marcas y etiquetas del eje X cada 500m
    marcaX = 500
    x_actual = 0
    while x_actual <= maxDist-500:
        x = margenX + x_actual * escalaX
        y1 = altoSVG - margenY
        y2 = y1 + 5
        svg.addLine(str(x), str(y1), str(x), str(y2), "#ffd700", "1")
        svg.addText(f"{int(x_actual)}", str(x-15), str(y2+15), "Verdana", "12", "fill:#ffd700")
        x_actual += marcaX

    # Añadir marca final del eje X
    if x_actual - marcaX < maxDist:
        x = margenX + maxDist * escalaX
        y1 = altoSVG - margenY
        y2 = y1 + 5
        svg.addLine(str(x), str(y1), str(x), str(y2), "#ffd700", "1")
        svg.addText(f"{int(maxDist)}", str(x-20), str(y2+15), "Verdana", "12", "fill:#ffd700")

    # Dibujar marcas y etiquetas del eje Y cada 5m
    marcaY = 5
    y_actual = 0
    while y_actual <= maxAlt:
        y = (altoSVG - margenY) - (y_actual - minAlt) * escalaY
        x1 = margenX - 5
        x2 = margenX
        svg.addLine(str(x1), str(y), str(x2), str(y), "#ffd700", "1")
        svg.addText(f"{int(y_actual)}", str(x1-35), str(y+5), "Verdana", "12", "fill:#ffd700")
        y_actual += marcaY

    puntos_svg = ""
    
    # Añadir punto de origen
    x0 = margenX
    y0 = (altoSVG - margenY) - (alt0 - minAlt) * escalaY
    puntos_svg += f"{x0},{y0} "

    # Añadir todos los puntos del circuito
    for dist, alt in zip(distancias, altitudes):
        x = margenX + dist * escalaX
        y = (altoSVG - margenY) - (alt - minAlt) * escalaY
        puntos_svg += f"{x},{y} "

    # Cerrar el polígono añadiendo puntos inferiores para crear el relleno
    puntos_svg += f"{anchoSVG-margenX},{altoSVG-margenY} {margenX},{altoSVG-margenY}"

    # Dibujar la polyline
    svg.addPolyline(points=puntos_svg, stroke="#ffd700", strokeWidth="2", fill="#0d1b2a")

    # Escribir el archivo SVG final
    svg.escribir("altimetria.svg")
    print("Archivo generado: altimetria.svg")



if __name__ == "__main__":
    main()
