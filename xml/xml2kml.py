# xml2kml.py
import xml.etree.ElementTree as ET


class Kml:
    
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


def main():
    
    
    tree = ET.parse("circuitoEsquema.xml")
    root = tree.getroot()

    # Definición el diccionario de namespaces 
    ns = {'u': 'http://www.uniovi.es'}

   
    nuevoKML = Kml()
    ruta = []

    # Extraer coordenadas del punto de origen 
    lon0 = float(root.find('.//u:origen/u:coordenadas/u:longitud', ns).text)
    lat0 = float(root.find('.//u:origen/u:coordenadas/u:latitud', ns).text)

    # Añadir marcador del origen al KML
    nuevoKML.addPlacemark("Origen", "Punto de inicio", lon0, lat0, 0, "relativeToGround")
    ruta.append((lon0, lat0, 0))

    # Buscar todos los puntos anónimos del circuito
    puntos = root.findall('.//u:puntosAnonimos', ns)
    for punto in puntos:
        # Extraer longitud y latitud de cada punto
        lon = float(punto.find('.//u:coordenadas/u:longitud', ns).text)
        lat = float(punto.find('.//u:coordenadas/u:latitud', ns).text)
        # Añadir coordenadas a la ruta
        ruta.append((lon, lat, 0))

    
    coor_str = "\n".join(f"{lon},{lat},{alt}" for lon, lat, alt in ruta)
    
    # Añadir línea que conecta todos los puntos de la ruta
    nuevoKML.addLineString(
        nombre="Ruta del circuito",
        extrude="1",
        tesela="1",
        listaCoordenadas=coor_str,
        modoAltitud="relativeToGround",
        color="#ff0000ff",  
        ancho="3"
    )

    # Escribir el archivo KML final
    nuevoKML.escribir("circuito.kml")
    print("Archivo KML generado: circuito.kml")

if __name__ == "__main__":
    main()
