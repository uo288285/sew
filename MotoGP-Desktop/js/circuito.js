class Circuito{
    

    constructor(){
        this.comprobarApiFile();
        this.inicializarInput();
    }

    inicializarInput(){
        let main = document.querySelector("body");
        var input = main.querySelectorAll("input");
        input[0].addEventListener("change", this.leerArchivoHTML(this));
    }

    comprobarApiFile(){
    if (window.File && window.FileReader && window.FileList && window.Blob) 
        {  
            let p = document.createElement("p");
            p.textContent ="Este navegador soporta el API File" ;
            document.body.appendChild(p);
        }
        else {
            p.textContent ="¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!" ;
            document.body.appendChild(p);
        }
            
    }

    leerArchivoHTML(files){
        var archivo = files[0];
        var tipoHTML = /html.*/;
        if(archivo.type.match(tipoHTML)){
            var lector = new FileReader();

            lector.onload = function(evento){

            }
            lector.readAsText(archivo);
        }
        else{
            console.log("error");
        }
    }

}
new Circuito();