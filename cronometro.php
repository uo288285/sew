<?php
include "./php/claseCronometro.php";
session_start();

if (!isset($_SESSION["cronometro"])) {
    $_SESSION["cronometro"] = new Cronometro();
}

$cronometro = $_SESSION["cronometro"];
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-CronometroPHP</title>
    <meta name="author" content="Miguel Arias Guerrero" />
    <meta name="description" content="Cronómetro creado a partir de PHP" />
    <meta name="keywords" content="MotoGP, tiempo, cronómetro,arrancar" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon.ico">
</head>

<body>
    <header>
        <h1><a href="index.html">MotoGP Desktop</a></h1>
        <nav>
            <a href="index.html" title="Información general">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de la meteorología">Meteorología</a>
            <a href="clasificaciones.php" title="Información de las clasificaciones">Clasificaciones</a>
            <a class="active" href="juegos.html" title="Información de los juegos">Juegos</a>
            <a href="ayuda.html" title="Información de la ayuda">Ayuda</a>
        </nav>
    </header>

    <p>Estás en <a href="index.html">Inicio</a> | <a href="juegos.html">Juegos</a>|<strong> CronometroPHP</strong></p>
    <main>
        <h2>CronómetroPHP de MotoGP-Desktop</h2>

        <h3>Pulse un botón</h3>

        <form action="#" method="post">
            <input type="submit" name="start" value="Arrancar">
            <input type="submit" name="stop" value="Parar">
            <input type="submit" name="show" value="Mostrar Tiempo">
        </form>


        <?php
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

    </main>
</body>

</html>