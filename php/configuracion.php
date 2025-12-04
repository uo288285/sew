<?php
include "claseConfiguracion.php";
$config = new Configuracion();

?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Circuito</title>
    <meta name="author" content="Miguel Arias Guerrero" />
    <meta name="description" content="información sobre el circuito" />
    <meta name="keywords" content="MotoGP" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon.ico">
</head>

<body>
    <h2>Configuración del test</h2>

    <h3>Seleccione una acción:</h3>

    <form action="#" method="post">
        <input type="submit" name="reiniciar" value="Reiniciar BD">
        <input type="submit" name="eliminar" value="Eliminar BD">
        <input type="submit" name="crear" value="Crear Nueva BD">
        <input type="submit" name="exportar" value="Exportar CSV">
        <input type="submit" name="botonUsuario" value="Crear nuevo usuario ">
    </form>

    <?php
    if (isset($_POST["reiniciar"])) {
        $config->reiniciarBD();
    }

    if (isset($_POST["eliminar"])) {
        $config->eliminarBD();
    }

    if (isset($_POST["crear"])) {
        $config->crearNuevaBD();
    }

    if (isset($_POST["exportar"])) {
        $config->exportarCSV();
    }

    if (isset($_POST["botonUsuario"])) {
        $config->nuevoParticipante();
    }
    if (isset($_POST["nuevoUsuario"])) {
        $config->insertarParticipante();
        $config->insertarDispositivoUsuario();
    }

    ?>

</body>

</html>