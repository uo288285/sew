class Noticias {
  #busqueda;
  #url;

  constructor() {
    this.#busqueda = "motogp";
    this.#url = "g8YVFB5WljcO97QlDvg1FwLg3ZFHyWdcgiGov251";
    this.datosNoticias = null;
  }

  // Método que realiza la consulta al servicio web usando fetch()
  async buscar() {
    const url = `https://api.thenewsapi.com/v1/news/all?api_token=${
      this.#url
    }&search=${this.#busqueda}&language=es&limit=3`;

    try {
      const response = await fetch(url);

      this.datosNoticias = await response.json();

      this.mostrarNoticiasEnHTML();
    } catch (error) {
      console.error("Error al obtener las noticias:", error);
    }
  }

  procesarInformacion() {
    return this.datosNoticias.data.map((noticia) => ({
      titular: noticia.title,
      entradilla: noticia.description,
      enlace: noticia.url,
      fuente: noticia.source,
    }));
  }

  mostrarNoticiasEnHTML() {
    const noticias = this.procesarInformacion();

    const $main = $("main");

    const $section = $("<section></section>");
    const $h3 = $("<h3>Últimas noticias de MotoGP</h3>");
    $section.append($h3);

    // Crear lista no ordenada
    const $ul = $("<ul></ul>");

    // Añadir cada noticia como un <li>
    noticias.forEach((n) => {
      const $li = $(`
                <li>
                    <strong>${n.titular}</strong><br>
                    ${n.entradilla}<br>
                    Fuente: ${n.fuente}<br>
                    <a href="${n.enlace}" target="_blank">Leer más</a>
                </li>
            `);
      $ul.append($li);
    });
    $section.append($ul);
    $main.append($section);
  }
}
