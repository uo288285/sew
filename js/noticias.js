class Noticias {
  #busqueda;
  #url;
  #noticias;

  constructor() {
    this.#busqueda = "motogp";
    this.#url = "g8YVFB5WljcO97QlDvg1FwLg3ZFHyWdcgiGov251";
    this.#noticias = [];
  }

  async cargarYMostrarNoticias() {
    await this.#buscar();
    this.#mostrarNoticiasEnHTML();
  }

  async #buscar() {
    const url = `https://api.thenewsapi.com/v1/news/all?api_token=${
      this.#url
    }&search=${this.#busqueda}&language=es&limit=3`;

    try {
      const response = await fetch(url);
      const datosJSON = await response.json();

      this.#procesarInformacion(datosJSON);
    } catch (error) {
      console.error("Error al obtener las noticias:", error);
    }
  }

  #procesarInformacion(datos) {
    this.#noticias = [];

    const arrayNoticias = datos.data;

    for (let i = 0; i < arrayNoticias.length; i++) {
      const noticia = arrayNoticias[i];

      const noticiaProcessada = {
        titular: noticia.title,
        entradilla: noticia.description,
        enlace: noticia.url,
        fuente: noticia.source,
      };

      this.#noticias.push(noticiaProcessada);
    }
  }

  #mostrarNoticiasEnHTML() {
    const $main = $("main");

    const $section = $("<section></section>");
    const $h3 = $("<h3>Últimas noticias de MotoGP</h3>");
    $section.append($h3);

    for (let i = 0; i < this.#noticias.length; i++) {
      const n = this.#noticias[i];

      const $noticia = $(`
      <h4>${n.titular}</h4>
      <p>${n.entradilla}</p>
      <p>Fuente: ${n.fuente}</p>
      <p><a href="${n.enlace}" target="_blank">Leer más</a></p>`);

      $section.append($noticia);
    }
    $main.append($section);
  }
}
