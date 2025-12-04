<?php
include "claseCronometro.php";
include "claseConfiguracion.php";
session_start();

if (!isset($_SESSION["cronometro"])) {
    $_SESSION["cronometro"] = new Cronometro();
}
$cronometro = $_SESSION["cronometro"];
?>

<?php
class Test
{
    private $cronometro;
    private $iniciado = false;
    private $mostrarObservaciones = false;
    private $final = false;
    private $config;

    public function __construct($cronometro)
    {
        $this->cronometro = $cronometro;
        $this->config = new Configuracion();

        if (isset($_POST['start'])) {
            $this->iniciado = true;
            $this->cronometro->arrancar();
        }
        if (isset($_POST['enviar'])) {
            $this->guardarRespuestas();
            $this->mostrarObservaciones = true;
            $this->iniciado = false;
        }
        if (isset($_POST['guardarComentarios'])) {
            $this->final = true;
        }
    }

    public function mostrarBotonInicio()
    {
        if (!$this->iniciado && !$this->mostrarObservaciones && !$this->final) {
            echo "<p>Pulsa el botón para iniciar la prueba</p>";
            echo "<form method='post'>
                    <input type='submit' name='start' value='Iniciar Prueba'>
                  </form>";
        }
    }

    public function mostrarFormulario()
    {
        if ($this->iniciado) {
            echo "<form method='post'>
                <p>¿Dónde nació el piloto Maverick Viñales?</p>
                <p><input type='text' name='respuesta[1]'/></p>

                <p>¿En qué país se encuentra el circuito de Sepang?</p>
                <p><input type='text' name='respuesta[2]'/></p>

                <p>¿Quién ganó la carrera en Sepang este año?</p>
                <p><input type='text' name='respuesta[3]'/></p>

                <p>¿Después de la carrera que piloto iba primero en el mundial?</p>
                <p><input type='text' name='respuesta[4]'/></p>

                <p>¿Qué día tuvo lugar la carrera de Sepang?</p>
                <p><input type='text' name='respuesta[5]'/></p>

                <p>¿Cuánto tardó el ganador de la carrera del circuito de Sepang en cruzar la meta?</p>
                <p><input type='text' name='respuesta[6]'/></p>

                <p>¿En qué año fue campeón del mundo Moto3 Maverick Viñales?</p>
                <p><input type='text' name='respuesta[7]'/></p>

                <p>¿Qué es una chicane?</p>
                <p><input type='text' name='respuesta[8]'/></p>

                <p>¿Cuál es el gentilicio del país de la carrera?</p>
                <p><input type='text' name='respuesta[9]'/></p>

                <p>¿En qué año nació el piloto Maverick Viñales?</p>
                <p><input type='text' name='respuesta[10]'/></p>

                <p><input type='submit' name='enviar' value='Terminar prueba'></p>
              </form>";
        }
    }


    public function guardarComentarios()
    {
        $numero = isset($_POST['numero']) ? intval($_POST['numero']) : null;
        $comentarios = isset($_POST['comentarios']) ? trim($_POST['comentarios']) : '';
        $observacion = isset($_POST['observacion']) ? trim($_POST['observacion']) : '';
        $propuestas = isset($_POST['propuestas']) ? trim($_POST['propuestas']) : '';

        $this->config->guardarUltimosDatos($numero, $comentarios, $observacion, $propuestas);
        echo "<p>Formulario guardado correctamente.</p>";
    }


    private function guardarRespuestas()
    {
        $this->cronometro->parar();

        $respuestas = $_POST['respuesta'] ?? [];

        if (!empty($respuestas)) {
            $this->config->guardarRespuestasTest($respuestas);

            $incompleto = false;
            foreach ($respuestas as $resp) {
                if (trim($resp) === '') {
                    $incompleto = true;
                    break;
                }
            }
            $tiempo = $this->cronometro->getTiempo();
            $this->config->registrarTiempoTest($tiempo, $incompleto);
            $this->mostrarObservaciones = true;
        } else {
            echo "<p>Error: faltan datos del usuario o respuestas.</p>";
        }
    }



    public function mostrarFormularioObservador()
    {
        if ($this->mostrarObservaciones) {

            echo "<form method='post'>";

            echo "<h3>Valoración aplicación</h3>";
            echo '
            <label for="numero">Puntuación:</label>
            <input type="number" id="numero" name="numero" min="0" max="10">
        ';

            echo "<h3>Comentarios sobre la aplicación</h3>";
            echo '
            <textarea name="comentarios" rows="6" cols="60" placeholder="Escribe aquí tus comentarios sobre la aplicación si tienes..."></textarea>
        ';

            echo "<h3>Propuestas para mejorar la aplicación</h3>";
            echo '
            <textarea name="propuestas" rows="6" cols="60" placeholder="Escribe aquí tus propuestas de mejora..."></textarea>
        ';

            echo "<h3>Comentarios del observador</h3>";
            echo '
            <textarea name="observacion" rows="6" cols="60" placeholder="Escribe aquí las observaciones del facilitador..."></textarea>
        ';

            echo '
            <br><br>
            <input type="submit" name="guardarComentarios" value="Guardar todo">
        ';

            echo "</form>";
        }
    }
}
$test = new Test($cronometro);

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
    <h2>Test sobre la aplicación</h2>

    <?php
    $test->mostrarBotonInicio();
    $test->mostrarFormulario();
    $test->mostrarFormularioObservador();
    if (isset($_POST['guardarComentarios'])) {
        $test->guardarComentarios();
    }
    ?>
</body>

</html>