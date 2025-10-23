# xml2kml.py
# -*- coding: utf-8 -*-
"""
Convierte un XML de circuito en un archivo KML
@author: Tu nombre
"""

import xml.etree.ElementTree as ET

# Clase Kml integrada
class Kml:
    """Genera archivos KML con puntos y líneas"""
    def __init__(self):
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz,'Document')

    def addPlacemark(self, nombre, descripcion, long, lat, alt, modoAltitud):
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = nombre
        ET.SubElement(pm,'description').text = descripcion
        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = f"{long},{lat},{alt}"
        ET.SubElement(punto,'altitudeMode').text = modoAltitud

    def addLineString(self, nombre, extrude, tesela, listaCoordenadas, modoAltitud, color, ancho):
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = nombre
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls,'extrude').text = extrude
        ET.SubElement(ls,'tessellation').text = tesela
        ET.SubElement(ls,'coordinates').text = listaCoordenadas
        ET.SubElement(ls,'altitudeMode').text = modoAltitud

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement(linea, 'color').text = color
        ET.SubElement(linea, 'width').text = ancho

    def escribir(self, nombreArchivoKML):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

# Función principal
def main():
    # Leer el XML del circuito
    tree = ET.parse("circuitoEsquema.xml")
    root = tree.getroot()

    # Namespace
    ns = {'u': 'http://www.uniovi.es'}

    # Crear KML
    nuevoKML = Kml()
    ruta = []

    # Añadir origen
    origen = root.find('u:origen/u:coordenadas', ns)
    lon0 = float(origen.find('u:longitudC', ns).text)
    lat0 = float(origen.find('u:latitud', ns).text)
    alt0 = float(origen.find('u:altitud', ns).text)
    nuevoKML.addPlacemark("Origen", "Punto de inicio", lon0, lat0, alt0, "relativeToGround")
    ruta.append((lon0, lat0, alt0))

    # Añadir puntos anónimos
    puntos = root.findall('u:puntosAnonimos', ns)
    for i, punto in enumerate(puntos, start=1):
        coord = punto.find('u:coordenadas', ns)
        lon = float(coord.find('u:longitudC', ns).text)
        lat = float(coord.find('u:latitud', ns).text)
        alt = float(coord.find('u:altitud', ns).text)
        nombre = f"Punto {i}"
        nuevoKML.addPlacemark(nombre, "Punto del circuito", lon, lat, alt, "relativeToGround")
        ruta.append((lon, lat, alt))

    # Crear LineString conectando los puntos
    coor_str = "\n".join(f"{lon},{lat},{alt}" for lon, lat, alt in ruta)
    nuevoKML.addLineString(
        nombre="Ruta del circuito",
        extrude="1",
        tesela="1",
        listaCoordenadas=coor_str,
        modoAltitud="relativeToGround",
        color="#ff0000ff",
        ancho="3"
    )

    # Guardar archivo KML
    nuevoKML.escribir("circuito.kml")
    print("Archivo KML generado: circuito.kml")

if __name__ == "__main__":
    main()
