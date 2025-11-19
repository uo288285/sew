class Circuito{
    

    constructor(){
        this.comprobarApiFile();
        this.inicializarInput();
    }

    inicializarInput(){
        let main = document.querySelector("body");
        var input = main.querySelectorAll("input");
        input[0].addEventListener("change", (evento) => this.leerArchivoHTML(evento.target.files));
        input[1].addEventListener("change", (evento) => new CargadorSVG(evento));
        input[2].addEventListener("change", (evento) => new CargadorKML(evento));
    }

    comprobarApiFile(){
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) 
        {  
            let p = document.createElement("p");
            p.textContent ="Este navegador no soporta el API File" ;
            document.body.insertBefore(p, document.querySelector("h2 + p"));
            
        }
            
    }

    leerArchivoHTML(files) {
    var archivo = files && files[0];
    if (!archivo) {
        console.error("No se ha seleccionado ningún archivo.");
        return;
    }

    var tipoHTML = /html.*/; // para mime types
    
    if (archivo.type.match(tipoHTML)) {
        var lector = new FileReader();

        lector.onload = () => {
            let contenido = lector.result;
            this.mostrarInformacion(contenido);
        };
        lector.readAsText(archivo);
    } 
}

     mostrarInformacion(contenidoHTML) {
        // Crear un parser para interpretar el HTML leído
        let parser = new DOMParser();
        let doc = parser.parseFromString(contenidoHTML, "text/html");

        // Creamos un contenedor donde pondremos el contenido leído
        let seccion = document.createElement("section");

        // Extraemos el título principal y subtítulos
        let titulo = doc.querySelector("h1")?.outerHTML || "";
        let datos = doc.querySelector("h2:nth-of-type(1)")?.outerHTML || "";
        let parrafos = "";
        doc.querySelectorAll("p").forEach(p => {
            parrafos += p.outerHTML;
        });

        let tablas = "";
        doc.querySelectorAll("table").forEach(t => {
            tablas += t.outerHTML;
        });

        let imagenes = "";
        doc.querySelectorAll("img").forEach(img => {
            imagenes += img.outerHTML;
        });

        let videos = "";
        doc.querySelectorAll("video").forEach(v => {
            videos += v.outerHTML;
        });

        // Insertamos todo en el documento principal
        seccion.innerHTML = `
            <h2>Contenido del archivo cargado:</h2>
            ${titulo}
            ${datos}
            ${parrafos}
            ${imagenes}
            ${videos}
            ${tablas}
        `;

        document.body.appendChild(seccion);
    }



}

class CargadorSVG{

    constructor(input){
        this.leerArchivoSVG(input);
    }

        leerArchivoSVG(input) {
        const archivo = input.target.files[0];
        

       if (archivo && archivo.type === 'image/svg+xml'){
            const lector = new FileReader();

         lector.onload = () => {
            const contenido = lector.result;
            this.insertarSVG(contenido);
        };
        lector.readAsText(archivo);
       }

        
    }

    // Inserta el contenido SVG leído en el documento HTML
    insertarSVG(contenidoSVG) {
    const contenedor = document.createElement("section");
    document.body.appendChild(contenedor);

    const parser = new DOMParser();
    const documentoSVG = parser.parseFromString(contenidoSVG, 'image/svg+xml');
    const svg = documentoSVG.documentElement;

    
    if (!svg.hasAttribute("viewBox")) {
        svg.setAttribute("viewBox", "0 0 1200 400");
    }

    

    contenedor.innerHTML = "";
    contenedor.appendChild(svg);
}
}

class CargadorKML {

    #origen;
    #puntos;
    #mapa;
    #divMapa;

    constructor(eventoInput) {
    this.#origen = null;
    this.#puntos = [];
    this.#divMapa = document.querySelector("body > div");
    this.#crearMapa();
    this.leerArchivoKML(eventoInput);
}

    /* -------- Crear mapa dinámico -------- */
    #crearMapa() {
        this.#mapa = new google.maps.Map(this.#divMapa, {
            center: { lat: 2.7601, lng: 101.7366 },
            zoom: 14
        });
    }

    /* -------- Leer archivo KML (TAREA 4) -------- */
    leerArchivoKML(evento) {
        const archivo = evento.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();

        lector.onload = () => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(lector.result, "text/xml");

            const lineStringNode = xml.querySelector("LineString > coordinates");
           

            const coordStr = lineStringNode.textContent.trim();
            const coords = coordStr.split(/\s+/)
                .filter(s => s.trim() !== "")
                .map(par => {
                     const [lon, lat] = par.split(",");
                        return { lat: parseFloat(lat), lng: parseFloat(lon) };
                            })
                            



            this.#origen = coords[0];
            this.#puntos = coords;

            this.insertarCapaKML();
        };

        lector.readAsText(archivo);
    }

    /* -------- Insertar capa KML en mapa (TAREA 5) -------- */
    insertarCapaKML() {
    if (!this.#origen || this.#puntos.length === 0) {
        console.error("Datos KML no cargados.");
        return;
    }
    
    // Polilínea del circuito
    const polilinea = new google.maps.Polyline({
        path: this.#puntos,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        geodesic: true
    });
    polilinea.setMap(this.#mapa);

    
}

}
new Circuito();
