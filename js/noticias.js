class Noticias {
  #busqueda;
  #url;

  constructor() {
    this.#busqueda = "motogp";
    this.#url = "g8YVFB5WljcO97QlDvg1FwLg3ZFHyWdcgiGov251";
    this.datosNoticias=null;
  }


  // Método que realiza la consulta al servicio web usando fetch()
    async buscar() {
const url = `https://api.thenewsapi.com/v1/news/all?api_token=${this.#url}&search=${this.#busqueda}&language=es&limit=3`;

try {
            const response = await fetch(url);
            
            this.datosNoticias = await response.json();

            // Tras obtener los datos, procesamos y mostramos las noticias
            this.mostrarNoticiasEnHTML();
        } catch (error) {
            console.error("Error al obtener las noticias:", error);
        }
    }

    procesarInformacion() {
        if (!this.datosNoticias || !this.datosNoticias.data) {
            console.warn("No hay datos de noticias para procesar.");
            return [];
        }

        return this.datosNoticias.data.map(noticia => ({
            titular: noticia.title,
            entradilla: noticia.description,
            enlace: noticia.url,
            fuente: noticia.source
        }));
    }

    // Método que añade las noticias al main en una lista no ordenada
    mostrarNoticiasEnHTML() {
        const noticias = this.procesarInformacion();
        

        const $main = $("main");

        // Título de la sección
        $main.append("<h2>Últimas noticias de MotoGP</h2>");

        // Crear lista no ordenada
        const $ul = $("<ul></ul>");

        // Añadir cada noticia como un <li>
        noticias.forEach(n => {
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

        // Insertar la lista dentro del main
        $main.append($ul);
    }
}
