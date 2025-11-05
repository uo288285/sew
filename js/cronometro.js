class Cronometro{
    constructor(){
        this.tiempo = 0;
        this.inicio = null;
        this.corriendo = null;
    }


    arrancar(){
        if(this.inicio == null){
            try{
                this.inicio = Temporal.Now.instant();
            }catch(err){
                this.inicio = Date.now();
            }
            this.corriendo = setInterval(this.actualizar.bind(this), 100);
        }
        
    }


    actualizar(){
        let ahora;
        try {
            ahora = Temporal.Now.instant();
            this.tiempo = ahora.since(this.inicio).total('milliseconds');
        } catch (err) {
            ahora =  Date.now();
            this.tiempo = ahora - this.inicio;
        }
        this.mostrar();
        
    }

    mostrar() {
    
    const minutos = parseInt(this.tiempo / 60000);
    const segundos = parseInt((this.tiempo % 60000) / 1000);
    const decimas = parseInt((this.tiempo % 1000) / 100);

    
    const minutosTexto = (minutos < 10 ? "0" : "") + minutos;
    const segundosTexto = (segundos < 10 ? "0" : "") + segundos;

    
    const texto = minutosTexto + ":" + segundosTexto + "." + decimas;


    const p = document.querySelector('main p');
    p.innerText = texto;
}


    parar(){
        clearInterval(this.corriendo);
        this.corriendo = null;
    }

    reiniciar(){
        this.parar();
        this.tiempo = 0;
        this.inicio = null;
        this.mostrar();
    }

    
}