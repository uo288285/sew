<?php
include "claseConfiguracion.php";
$config = new Configuracion();

?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Test</title>
    <meta name="author" content="Miguel Arias Guerrero" />
    <meta name="description" content="Configuración del test de la aplicación" />
    <meta name="keywords" content="MotoGP, base de datos, reiniciar, crear usuario" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/favicon.ico">
</head>

<body>
    <header>
        <h1>
            MotoGP Desktop
        </h1>
    </header>
    <h2>Configuración del test:</h2>

    <form action="#" method="post">
        <input type="submit" name="reiniciar" value="Reiniciar BD">
        <input type="submit" name="eliminar" value="Eliminar BD">
        <input type="submit" name="crear" value="Crear Nueva BD">
        <input type="submit" name="exportar" value="Exportar CSV">
        <input type="submit" name="botonUsuario" value="Crear nuevo usuario ">
    </form>

    <form action="#" method="post" enctype="multipart/form-data">
        <label for="archivo">Selecciona el archivo CSV:</label>
        <input type="file" name="archivo" id="archivo" accept=".csv">
        <button type="submit" name="importar">Importar CSV</button>

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

    if (isset($_POST["importar"])) {

        if (!isset($_FILES["archivo"]) || $_FILES["archivo"]["error"] === UPLOAD_ERR_NO_FILE) {
            echo "<p>Por favor, selecciona un archivo CSV antes de importar.</p>";
        } else {
            $rutaTemporal = $_FILES["archivo"]["tmp_name"];
            $config->importarCSV($rutaTemporal);
        }
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