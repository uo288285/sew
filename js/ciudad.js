class Ciudad{
    
    constructor(nombre,pais,gentilicio){
        this.nombre=nombre;
        this.pais=pais;
        this.gentilicio=gentilicio;
        this.rellenarValores();
    }

    rellenarValores(){
        this.cantidadPoblacion =2075600;
        this.coordenadas="3.1527826326283592, 101.6966140032153";
    }

    darNombreCiudad(){
        return this.nombre;
        
    }

    darNombrePais(){
        return this.pais;
    }

    darInfo(){
        return "<li>El gentilicio es " + this.gentilicio +"</li><li>La poblacion es de "+ this.cantidadPoblacion +" habitantes</li>";
    }

    darCoordenadas(){
        return this.coordenadas;
    }

}