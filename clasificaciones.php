<?php 

class Clasificacion{

    private $documento;
    private $datos;

    public function __construct(){
        $this->documento = "./xml/circuitoEsquema.xml";
    }

    public function consultar(){

        $datos = file_get_contents($this->documento);
        $datos = preg_replace("/>\s*</", ">\n<", $datos);
        $xml = new SimpleXMLElement($datos);

        echo "<h3> Ganador y tiempo de la carrera</h3>";
        echo "<p>Ganador de la carrera: {$xml->ganador} </p>";
        $duracion = $xml->tiempoGanador;
        $interval = new DateInterval($duracion);
        echo "Tiempo del ganador: " . $interval->i . " minutos y " . $interval->s . " segundos";

        echo "<h3> Clasificación del mundial tras la carrera</h3>";
        foreach ($xml->clasificación->piloto as $p) {
            $puesto = $p['puesto'];            
            echo "<p>Puesto $puesto: $p</p>";
        }
    }
}
?>


<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>
    <meta name ="author" content="Miguel Arias Guerrero"/>
    <meta name ="description" content ="Clasificaciones sobre pilotos" />
    <meta name ="keywords" content ="MotoGP" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css "/>
    <link rel="stylesheet" type="text/css" href="estilo/layout.css "/>
    <link rel="icon" href="multimedia/favicon.ico">
</head>

<body>
    <header>
    <h1>
        <a href="index.html">MotoGP</a>
    </h1>
    <nav>
        <a href = "index.html" title = "Información general">Inicio</a>
        <a href = "piloto.html" title = "Información del piloto">Piloto</a>
        <a href = "circuito.html" title = "Información del circuito">Circuito</a>
        <a href = "meteorologia.html" title = "Información de la meteorología">Meteorología</a>
        <a class="active" href = "clasificaciones.php" title = "Información de las clasificaciones">Clasificaciones</a>
        <a href = "juegos.html" title = "Información de los juegos">Juegos</a>
        <a href = "ayuda.html" title = "Información de la ayuda">Ayuda</a>
    </nav>
    </header>
    <p>Estás en <a href="index.html">Inicio</a> | <strong>Clasificaciones</strong> </p>

    <h2>Clasificaciones de MotoGP-Desktop</h2>
    <?php 
    $clasificacion = new Clasificacion();
    $clasificacion->consultar();
    ?>

</body>
</html>

