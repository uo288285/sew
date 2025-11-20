<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Circuito</title>
    <meta name="author" content="Miguel Arias Guerrero"/>
    <meta name="description" content="información sobre el circuito" />
    <meta name="keywords" content="MotoGP" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css"/>
    <link rel="stylesheet" type="text/css" href="estilo/layout.css"/>
    <link rel="icon" href="multimedia/favicon.ico">
</head>

<body>
<header>
    <h1><a href="index.html">MotoGP</a></h1>
    <nav>
        <a href="index.html">Inicio</a>
        <a href="piloto.html">Piloto</a>
        <a class="active" href="circuito.html">Circuito</a>
        <a href="meteorologia.html">Meteorología</a>
        <a href="clasificaciones.html">Clasificaciones</a>
        <a href="juegos.html">Juegos</a>
        <a href="ayuda.html">Ayuda</a>
    </nav>
</header>

<p>Estás en <a href="index.html">Inicio</a> | Cronómetro</p>

<h2>Cronómetro de MotoGP-Desktop</h2>

<h3>Pulse un botón</h3>

<form action="#" method="post">
    <input type="submit" name="start" value="Arrancar">
    <input type="submit" name="stop" value="Parar">
    <input type="submit" name="show" value="Mostrar Tiempo">
</form>

</body>
</html>

<?php

session_start();

class Cronometro {
    private $inicio;
    private $tiempo;

    public function __construct() {
        $this->inicio = null;
        $this->tiempo = 0;
    }

    public function arrancar() {
        $this->inicio = microtime(true);
    }

    public function parar() {
        if ($this->inicio !== null) {
            $this->tiempo = microtime(true) - $this->inicio;
        }
    }

    public function mostrar() {
    $t = $this->tiempo;

    $min = floor($t / 60);

    $seg = floor($t % 60);

    $decimas = floor(($t - floor($t)) * 10);

    return sprintf("Tiempo transcurrido: %02d:%02d.%d", $min, $seg, $decimas);
    }
}


if (!isset($_SESSION["cronometro"])) {
    $_SESSION["cronometro"] = new Cronometro();
}

$cronometro = $_SESSION["cronometro"];

if (isset($_POST["start"])) {
    $cronometro->arrancar();
}

if (isset($_POST["stop"])) {
    $cronometro->parar();
}

if (isset($_POST["show"])) {
    echo "<p>" . $cronometro->mostrar() . "</p>";
}

?>

