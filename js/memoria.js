class Memoria {
  #tablero_bloqueado = true;
  #primera_carta = null;
  #segunda_carta = null;
  #cronometro = null;

  constructor() {
    this.#tablero_bloqueado = true;
    this.#primera_carta = null;
    this.#segunda_carta = null;
    this.#inicializarEventos();
    this.#barajarCartas();
    this.#cronometro = new Cronometro();
    this.#cronometro.arrancar();
  }

  #barajarCartas() {
    var main = document.querySelector("main");
    var cartas = main.querySelectorAll("article");

    var cartasParaBarajar = Array.from(cartas);

    for (var i = cartasParaBarajar.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = cartasParaBarajar[i];
      cartasParaBarajar[i] = cartasParaBarajar[j];
      cartasParaBarajar[j] = temp;
    }

    for (var k = 0; k < cartasParaBarajar.length; k++) {
      main.appendChild(cartasParaBarajar[k]);
    }
    this.#tablero_bloqueado = false;
  }

  #inicializarEventos() {
    const main = document.querySelector("main");
    const cartas = main.querySelectorAll("article");
    cartas.forEach((carta) => {
      carta.addEventListener("click", () => this.voltearCarta(carta));
    });
  }

  voltearCarta(carta) {
    if (this.#tablero_bloqueado) return;
    if (carta.getAttribute("data-estado") == "revelada") return;
    if (carta.getAttribute("data-estado") == "volteada") return;

    carta.setAttribute("data-estado", "volteada");

    if (this.#primera_carta === null) {
      this.#primera_carta = carta;
    } else {
      this.#segunda_carta = carta;
      this.#comprobarPareja();
    }
  }

  #reiniciarAtributos() {
    this.#tablero_bloqueado = true;
    this.#primera_carta = null;
    this.#segunda_carta = null;
  }

  #deshabilitarCartas() {
    let cartas = document.querySelectorAll("main article");

    for (let i = 0; i < cartas.length; i++) {
      let carta = cartas[i];
      if (carta.getAttribute("data-estado") === "volteada") {
        carta.setAttribute("data-estado", "revelada");
      }
    }
    this.#reiniciarAtributos();
    this.#comprobarJuego();
    this.#tablero_bloqueado = false;
  }

  #comprobarJuego() {
    let cartas = document.querySelectorAll("main article");
    let juegoTerminado = true;

    for (let i = 0; i < cartas.length; i++) {
      if (cartas[i].getAttribute("data-estado") !== "revelada") {
        juegoTerminado = false;
        break;
      }
    }

    if (juegoTerminado) {
      this.#cronometro.parar();
    }
  }

  #cubrirCartas() {
    this.#tablero_bloqueado = true;
    setTimeout(this.#comprobacion.bind(this), 1500);
  }

  #comprobacion() {
    if (this.#primera_carta !== null)
      this.#primera_carta.setAttribute("data-estado", "");
    if (this.#segunda_carta !== null)
      this.#segunda_carta.setAttribute("data-estado", "");

    this.#reiniciarAtributos();
    this.#tablero_bloqueado = false;
  }

  #comprobarPareja() {
    let img1 = this.#primera_carta.children[1];
    let img2 = this.#segunda_carta.children[1];

    img1.getAttribute("alt") === img2.getAttribute("alt")
      ? this.#deshabilitarCartas()
      : this.#cubrirCartas();
  }
}
