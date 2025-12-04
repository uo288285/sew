class Carrusel {
  #busqueda;
  #actual;
  #maximo;
  #$imagen;
  #fotografias;

  constructor() {
    this.#busqueda = "Sepang";
    this.#actual = 0;
    this.#maximo = 4;
    this.#$imagen = null;
  }

  #getFotografias() {
    const flickrAPI =
      "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    return $.getJSON(flickrAPI, {
      tags: this.#busqueda,
      tagmode: "any",
      format: "json",
    }).then((data) => {
      return this.#procesarJSONFotografias(data);
    });
  }

  #procesarJSONFotografias(data) {
    return data.items.slice(0, this.#maximo + 1).map((item) => ({
      titulo: item.title,
      url: item.media.m.replace("_m.", "_z."),
    }));
  }

  mostrarFotografias() {
    const $article = $("<article></article>");
    const $tituloFotos = $("<h2></h2>").text(
      "Imágenes del circuito de Petronas Sepang International Circuit"
    );
    this.#$imagen = $("<img>");

    $article.append($tituloFotos, this.#$imagen);
    $("main").append($article);

    this.#getFotografias().then((fotografias) => {
      this.#fotografias = fotografias;

      if (this.#fotografias.length === 0) {
        $article.append("<p>No se encontraron fotografías.</p>");
        return;
      }

      const primera = this.#fotografias[this.#actual];
      this.#$imagen
        .attr("src", primera.url)
        .attr("alt", primera.titulo || "Sin título");

      setInterval(this.#cambiarFotografia.bind(this), 3000);
    });
  }

  #cambiarFotografia() {
    this.#actual = (this.#actual + 1) % (this.#maximo + 1);
    const foto = this.#fotografias[this.#actual];
    this.#$imagen
      .attr("src", foto.url)
      .attr("alt", foto.titulo || "Sin título");
  }
}
