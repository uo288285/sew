class Cronometro{
    constructor(){
        this.tiempo = 0;
        this.arrancar();
    }


    arrancar(){
        if(this.inicio == null){
            try{
                this.inicio = Temporal.now.instant();
            }catch(err){
                this.inicio = Date.now();
            }
            this.corriendo = this.actualizar();
        }
        
    }


    actualizar(){
        try{
            this.tiempo = setInterval(Temporal.now.instant() - this.inicio,100);
        }catch(err){
            this.tiempo = setInterval(Date.now() - this.inicio,100);
        }
        
    }

    mostrar(){
        minutos = parseInt(tiempo/60000);
        restaMinutos = tiempo%60000;
        segundos = parseInt(restaMinutos/1000);
        restaSegundos = segundos%1000;
        decimasSegundo = parseInt(restaSegundos/100);

        const p = document.querySelector('main').querySelector('p');
        p.innerText = " "+minutos + " " + segundos + " " + decimasSegundo;
    }

    parar(){
        this.corriendo = clearInterval(this.tiempo)
    }

    reiniciar(){
        this.corriendo = clearInterval(this.tiempo);
        this.tiempo = 0;
        mostrar();
    }
}