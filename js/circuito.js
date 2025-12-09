class Circuito {
  constructor() {
    this.comprobarApiFile();
    this.inicializarInput();
  }

  inicializarInput() {
    const inputs = document.querySelectorAll("input");

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      if (input.name === "archivoHTML") {
        input.addEventListener("change", (evento) => {
          this.leerArchivoHTML(evento.target.files);
        });
      }

      if (input.name === "archivoSVG") {
        input.addEventListener("change", (evento) => {
          new CargadorSVG(evento);
        });
      }

      if (input.name === "archivoKML") {
        input.addEventListener("change", (evento) => {
          new CargadorKML(evento);
        });
      }
    }
  }

  comprobarApiFile() {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      let p = document.createElement("p");
      p.textContent = "Este navegador no soporta el API File";
      let main = document.querySelector("main");
      let primerParrafo = main.querySelector("h2 + p");
      main.insertBefore(p, primerParrafo);
    }
  }

  leerArchivoHTML(files) {
    const archivo = files && files[0];

    const tipoHTML = /html.*/;

    if (archivo.type.match(tipoHTML)) {
      const lector = new FileReader();

      lector.onload = () => {
        let contenido = lector.result;
        this.mostrarInformacion(contenido);
      };
      lector.readAsText(archivo);
    }
  }

  mostrarInformacion(contenidoHTML) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(contenidoHTML, "text/html");

    let seccion = document.createElement("section");

    let titulo = document.createElement("h2");
    titulo.textContent = "Contenido del archivo cargado:";
    seccion.appendChild(titulo);

    let htmlACopiar = "";

    let nodos = doc.body.childNodes;

    for (let i = 0; i < nodos.length; i++) {
      let nodo = nodos[i];

      if (nodo.tagName === "H1") {
        continue;
      }

      let html = nodo.outerHTML || nodo.textContent || "";

      htmlACopiar += html;
    }

    seccion.innerHTML += htmlACopiar;

    let main = document.querySelector("main");
    main.appendChild(seccion);
  }
}

class CargadorSVG {
  constructor(input) {
    this.leerArchivoSVG(input);
  }

  leerArchivoSVG(input) {
    const archivo = input.target.files[0];

    if (archivo && archivo.type === "image/svg+xml") {
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
    let titulo = document.createElement("h2");
    titulo.textContent = "Contenido del archivo cargado:";
    contenedor.appendChild(titulo);
    let main = document.querySelector("main");
    main.appendChild(contenedor);

    const parser = new DOMParser();
    const documentoSVG = parser.parseFromString(contenidoSVG, "image/svg+xml");
    const svg = documentoSVG.documentElement;

    if (!svg.hasAttribute("viewBox")) {
      svg.setAttribute("viewBox", "0 0 1200 400");
    }
    svg.setAttribute("version", "1.1");

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
    const div = document.createElement("div");
    document.body.appendChild(div);
    this.#divMapa = div;
    this.#crearMapa();
    this.leerArchivoKML(eventoInput);
  }

  #crearMapa() {
    this.#mapa = new google.maps.Map(this.#divMapa, {
      center: { lat: 2.7601, lng: 101.7366 },
      zoom: 15,
    });
  }

  leerArchivoKML(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = () => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(lector.result, "text/xml");

      const lineStringNode = xml.querySelector("LineString > coordinates");

      const coordStr = lineStringNode.textContent.trim();
      const coordArray = coordStr.split(/\s+/);
      const coords = [];

      for (let i = 0; i < coordArray.length; i++) {
        const par = coordArray[i].trim();

        const partes = par.split(",");
        const lon = parseFloat(partes[0]);
        const lat = parseFloat(partes[1]);

        coords.push({ lat: lat, lng: lon });
      }

      this.#origen = coords[0];
      this.#puntos = coords;

      this.insertarCapaKML();
    };

    lector.readAsText(archivo);
  }

  insertarCapaKML() {
    const polilinea = new google.maps.Polyline({
      path: this.#puntos,
      strokeColor: "#0000FF",
      strokeOpacity: 0.8,
      strokeWeight: 4,
      geodesic: true,
    });
    polilinea.setMap(this.#mapa);

    const marcador = new google.maps.Marker({
      position: this.#origen,
      title: "Punto origen",
    });
    marcador.setMap(this.#mapa);
  }
}
new Circuito();
