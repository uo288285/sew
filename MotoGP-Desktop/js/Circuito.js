class Ciudad{
    
    constructor(nombre,pais,gentilicio){
        this.nombre=nombre;
        this.pais=pais;
        this.gentilicio=gentilicio;
        rellenarValores();
    }

    rellenarValores(){
        this.cantidadPoblacion =2075600;
        this.coordenadas=3.1527826326283592, 101.6966140032153;
    }

    darNombreCiudad(){
        return this.nombre;
        
    }

    darNombrePais(){
        return this.pais;
    }

    darInfo(){
        return <ul><li><p>El gentilicio es + this.gentilicio</p></li><li>this.cantidadPoblacion</li></ul>
    }

    darCoordenadas(){
        document.write("<p>Las coordenadas son "+this.coordenadas+"<p>");
    }

}