class Carrusel {
  #busqueda;
  #actual;
  #maximo;

  constructor() {
    this.#busqueda = "Sepang";
    this.#actual = 0;
    this.#maximo = 4; 
    this.fotografias = [];
    this.$imagen = null;
  }

  // Método de instancia que devuelve una Promesa con el JSON de Flickr
  getFotografias() {
    const flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

    return $.getJSON(flickrAPI, {
      tags: this.#busqueda,
      tagmode: "any",
      format: "json",
    }).then(data => {
      // Mapeamos a un array de objetos con URL _z
      return data.items.map(item => ({
        titulo: item.title,
        autor: item.author,
        fecha: item.published,
        url: item.media.m.replace("_m.", "_z."),
        link: item.link
      }));
    });
  }

  // Procesa el array de fotos y extrae las 5 primeras únicas
  procesarJSONFotografias(fotosJSON) {
    
    const fotosSeleccionadas = [];
    const urlsVistas = new Set();

    for (let i = 0; i < fotosJSON.length && fotosSeleccionadas.length <= this.#maximo ; i++) {
      const foto = fotosJSON[i];
      if (!urlsVistas.has(foto.url)) {
        fotosSeleccionadas.push(foto);
        urlsVistas.add(foto.url);
      }
    }

    this.fotografias = fotosSeleccionadas;
  }

  mostrarFotografias() {
  const $main = $("main");

  const $article = $("<article></article>");
  const $encabezado = $("<h2></h2>").text("Imágenes del circuito de Petronas Sepang International Circuit");
  this.$imagen = $("<img>");

  $article.append($encabezado, this.$imagen);
  

  $main.append($article);

  this.getFotografias()
    .then(datos => {
      this.procesarJSONFotografias(datos);

      if (this.fotografias.length === 0) {
        $article.append("<p>No se encontraron fotografías.</p>");
        return;
      }

      this.#actual = 0;
      const primera = this.fotografias[this.#actual];
      this.$imagen.attr("src", primera.url).attr("alt", primera.titulo || "Sin título");

      setInterval(this.cambiarFotografia.bind(this), 3000);
    })
}


  cambiarFotografia() {
    if (this.fotografias.length === 0 || !this.$imagen) return;

    this.#actual = (this.#actual + 1) % (this.#maximo + 1);
    const foto = this.fotografias[this.#actual];
    const titulo = foto.titulo || "Sin título";
    const url = foto.url;

    this.$imagen.attr("src", url).attr("alt", titulo);
  }
}
