class Memoria{

    constructor(){
      this.tablero_bloqueado = true;
      this.primera_carta = null;
      this.segunda_carta = null;
      this.barajarCartas();
      this.tablero_bloqueado = false;
      this.cronometro = new Cronometro();
      this.cronometro.arrancar();
    }


    voltearCarta(carta) {
      if(this.tablero_bloqueado) return;
      if(carta.getAttribute('data-estado') == 'revelada') return;
      if(carta.getAttribute('data-estado') == 'volteada') return;

        carta.setAttribute('data-estado', 'volteada');

        if(this.primera_carta === null){
              this.primera_carta = carta;
         } else {
            this.segunda_carta = carta;
            this.comprobarPareja();
        }
    }

    barajarCartas() {
    var main = document.querySelector('main');
    var cartas = main.querySelectorAll('article'); 

    
    var cartasBarajadas = Array.from(cartas);

    for (var i = cartasBarajadas.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = cartasBarajadas[i];
        cartasBarajadas[i] = cartasBarajadas[j];
        cartasBarajadas[j] = temp;
    }

    for (var k = 0; k < cartasBarajadas.length; k++) {
        main.appendChild(cartasBarajadas[k]);
    }
}


    reiniciarAtributos(){
        this.tablero_bloqueado = true;
        this.primera_carta = null;
        this.segunda_carta = null;  
    }

    deshabilitarCartas() {
    let cartas = document.querySelectorAll('main article');

    for (let i = 0; i < cartas.length; i++) {
        let carta = cartas[i];
        if (carta.getAttribute('data-estado') === 'volteada') {
            carta.setAttribute('data-estado', 'revelada');
            carta.onclick = null;
        }
    }
    this.reiniciarAtributos();
    this.comprobarJuego();
    this.tablero_bloqueado = false;
    }


    comprobarJuego(){
    let cartas = document.querySelectorAll('main article');
    let juegoTerminado = true;

    for(let i = 0; i < cartas.length; i++){
        if(cartas[i].getAttribute('data-estado') !== 'revelada'){
            juegoTerminado = false;
            break; 
        }
    }

      if(juegoTerminado){
        
        this.cronometro.parar();
        
      }
      
    }

  cubrirCartas(){
    
    this.tablero_bloqueado = true;

    var self = this; 

      setTimeout(function(){
        if(self.primera_carta !== null) self.primera_carta.setAttribute('data-estado','');
        if(self.segunda_carta !== null) self.segunda_carta.setAttribute('data-estado','');

        self.reiniciarAtributos();

        self.tablero_bloqueado = false;
      }, 1500); 
  }


    comprobarPareja(){
          let img1 = this.primera_carta.children[1]; 
          let img2 = this.segunda_carta.children[1]; 

        
          (img1.getAttribute('alt') === img2.getAttribute('alt')) 
             ? this.deshabilitarCartas() 
             : this.cubrirCartas();
    }


  
}
