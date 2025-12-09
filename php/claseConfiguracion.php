<?php

class Configuracion
{
    private $servername;
    private $username;
    private $password;
    private $nombreDB;
    private $db;
    public $archivoCSV = "";
    private $idActual = 0;

    public function __construct()
    {
        $this->servername = "localhost";
        $this->username = "DBUSER2025";
        $this->password = "DBPSWD2025";
        $this->nombreDB = "UO288285_DB";
    }


    private function crearConexion()
    {
        $this->db = new mysqli($this->servername, $this->username, $this->password);
        if (!$this->db->select_db($this->nombreDB)) {
            echo "<p>Error: No se ha seleccionado la base de datos " . $this->nombreDB . "</p>";
        }
    }

    private function cerrarConexion()
    {
        $this->db->close();
    }


    private function obtenerIdActual()
    {
        $sql = "SELECT MAX(id_usuario) AS max_id FROM Usuarios";
        $resultado = $this->db->query($sql);

        if (!$resultado) {
            $this->idActual = 0;
            return;
        }

        $fila = $resultado->fetch_assoc();
        $this->idActual = $fila['max_id'] ?? 0;
    }




    private function ejecutarScriptSQL($archivo)
    {
        if (!file_exists($archivo)) {
            echo "<p>ERROR: No se encuentra el archivo $archivo</p>";
            return;
        }
        $script = file($archivo);
        $query = "";

        foreach ($script as $linea) {

            $linea = trim($linea);
            if ($linea === "" || str_starts_with($linea, "--")) continue;

            $query .= $linea . " ";

            if (str_ends_with($linea, ";")) {
                if ($this->db->query($query)) {
                } else {
                    echo  "<p>ERROR ejecutando: $query" . $this->db->error . "</p>";
                }
                $query = "";
            }
        }
    }





    public function crearNuevaBD()
    {
        $this->db = new mysqli($this->servername, $this->username, $this->password);

        if ($this->db->query("CREATE DATABASE IF NOT EXISTS UO288285_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci")) {
            echo "<p>Base de datos creada correctamente</p>";
        } else {
            echo "<p>Error creando la base de datos: " . $this->db->error . "</p>";
            return;
        }

        $this->db->select_db("UO288285_DB");

        $this->ejecutarScriptSQL("baseDatos.sql");

        $this->cerrarConexion();
    }

    public function reiniciarBD()
    {
        $this->crearConexion();
        $this->ejecutarScriptSQL("reiniciar.sql");
        $this->cerrarConexion();
    }

    public function eliminarBD()
    {
        $this->db = new mysqli($this->servername, $this->username, $this->password);
        $sql = "DROP DATABASE IF EXISTS $this->nombreDB;";
        if ($this->db->query($sql)) {
        } else {
            echo "<p>Error eliminando BD: " . $this->db->error . "</p>";
        }
        $this->cerrarConexion();
    }

    public function nuevoParticipante()
    {
        echo "<form method='post' autocomplete='off'>
                <h3>Introduce los datos del usuario</h3>
                
                <p>Género:
                <input type='radio' id='generoHombre' name='genero' value='Hombre'/>
                <label for='generoHombre'>Hombre</label>
                <input type='radio' id='generoMujer' name='genero' value='Mujer'/>
                <label for='generoMujer'>Mujer</label></p>
            
                <p><label for='profesion'>Profesión:</label>
                <input type='text' id='profesion' name='profesion'/></p>
                
                <p><label for='edad'>Edad:</label>
                <input type='text' id='edad' name='edad'/></p>
               
                <p><label for='pericia'>Pericia informática:</label>
                <input type='text' id='pericia' name='pericia'/></p>
                
                <p>Dispositivo:
                <input type='radio' id='dispositivoOrdenador' name='dispositivo' value='ordenador'/>
                <label for='dispositivoOrdenador'>Ordenador</label>
                <input type='radio' id='dispositivoTableta' name='dispositivo' value='tableta'/>
                <label for='dispositivoTableta'>Tableta</label>
                <input type='radio' id='dispositivoTelefono' name='dispositivo' value='telefono'/>
                <label for='dispositivoTelefono'>Teléfono</label></p>
           
                <input type='submit' name='nuevoUsuario' value='Enviar a base de datos'>
                </form>";
    }

    public function insertarParticipante()
    {

        $genero   = trim($_POST["genero"] ?? "");
        $profesion = trim($_POST["profesion"] ?? "");
        $edad      = trim($_POST["edad"] ?? "");
        $pericia   = trim($_POST["pericia"] ?? "");
        $dispositivo = trim($_POST["dispositivo"] ?? "");

        if ($genero === "" || $profesion === "" || $edad === "" || $pericia === "" || $dispositivo === "") {
            echo "<p>Error: Todos los campos son obligatorios. Vuelve a probar crear un nuevo usuario.</p>";
            return;
        }

        if (!ctype_digit($edad) || !ctype_digit($pericia)) {
            echo "<p>Error: Edad y pericia deben ser números válidos. Vuelve a probar crear un nuevo usuario.</p>";
            return;
        }

        $this->crearConexion();

        $sql = "INSERT INTO Usuarios ( genero, profesion, edad, pericia_informatica) 
            VALUES (?, ?, ?, ?)";

        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            echo "<p>Error en prepare: " . $this->db->error . "</p>";
            return;
        }

        $stmt->bind_param("ssii", $genero, $profesion, $edad, $pericia);

        if ($stmt->execute()) {
            echo "<p>Usuario insertado correctamente</p>";
        } else {
            echo "<p>Error al insertar: " . $stmt->error . "</p>";
        }

        $stmt->close();
        $this->cerrarConexion();
        $this->insertarDispositivoUsuario();
    }

    public function insertarDispositivoUsuario()
    {

        $this->crearConexion();
        $this->obtenerIdActual();
        $sql = "INSERT INTO Test_Usabilidad (id_usuario, dispositivo) VALUES (?, ?)";

        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            echo "<p>Error en prepare (dispositivo): " . $this->db->error . "</p>";
            return;
        }

        $id = $this->idActual;
        $dispositivo = $_POST["dispositivo"];

        $stmt->bind_param("is", $id, $dispositivo);

        if (!$stmt->execute()) {
            echo "<p>Error al insertar dispositivo: " . $stmt->error . "</p>";
        }

        $stmt->close();
        $this->cerrarConexion();
    }


    public function guardarRespuestasTest(array $respuestas)
    {

        $this->crearConexion();
        $this->obtenerIdActual();
        $sql = "INSERT INTO Respuestas_Test (id_usuario, numero_pregunta, respuesta)
            VALUES (?, ?, ?)";

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            echo "<p>Error en prepare: " . $this->db->error . "</p>";
            return;
        }

        foreach ($respuestas as $numPregunta => $respuesta) {
            $stmt->bind_param("iis", $this->idActual, $numPregunta, $respuesta);
            if (!$stmt->execute()) {
                echo "<p>Error insertando respuesta {$numPregunta}: " . $stmt->error . "</p>";
            }
        }


        $stmt->close();
        $this->cerrarConexion();
    }

    public function registrarTiempoTest(int $tiempoSegundos, bool $incompleto)
    {

        $this->crearConexion();
        $this->obtenerIdActual();
        $sql = "UPDATE Test_Usabilidad 
            SET tiempo_segundos = ?, tarea_completada = ? 
            WHERE id_usuario = ?";

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            echo "<p>Error en prepare (tiempo): " . $this->db->error . "</p>";
            return;
        }

        $tareaCompletada = $incompleto ? 0 : 1;
        $stmt->bind_param("iii", $tiempoSegundos, $tareaCompletada, $this->idActual);
        $stmt->execute();
        $stmt->close();
        $this->cerrarConexion();
    }

    public function guardarUltimosDatos($numero, $comentarios, $observacion, $propuestas)
    {
        $this->crearConexion();
        $this->obtenerIdActual();
        $this->guardarObservacionFacilitador($observacion);
        $this->guardarComentariosUsuario($numero, $comentarios, $propuestas);

        $this->cerrarConexion();
    }


    private function guardarObservacionFacilitador($observacion)
    {

        $sql = "INSERT INTO Observaciones_Facilitador (id_usuario, comentarios)
             VALUES (?,?)";

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            echo "<p>Error en prepare (tiempo): " . $this->db->error . "</p>";
            return;
        }

        $stmt->bind_param("is", $this->idActual, $observacion);
        $stmt->execute();
        $stmt->close();
    }

    private function guardarComentariosUsuario($numero, $comentarios, $propuestas)
    {
        $sql = "UPDATE Test_Usabilidad 
            SET comentarios_usuario = ?, propuestas_mejora = ?, valoracion = ?
            WHERE id_usuario = ?";

        $stmt = $this->db->prepare($sql);
        if (!$stmt) {
            echo "<p>Error en prepare (tiempo): " . $this->db->error . "</p>";
            return;
        }

        $stmt->bind_param("ssii", $comentarios, $propuestas, $numero, $this->idActual);
        $stmt->execute();
        $stmt->close();
    }




    public function exportarCSV()
    {
        $this->crearConexion();




        $sql = file_get_contents("consultaExportarDatos.sql");
        $resultado = $this->db->query($sql);

        $sql2 = file_get_contents("consultaRespuestas.sql");
        $resultado2 = $this->db->query($sql2);

        if (!$resultado) {
            echo "<p>Error al ejecutar la consulta: " . $this->db->error . "</p>";
            return;
        }

        $nombre = "export_" . date("Ymd_His") . ".csv";
        $ruta = "./" . $nombre;

        $fp = fopen($ruta, "w");
        fprintf($fp, chr(0xEF) . chr(0xBB) . chr(0xBF));

        // Columnas
        $columnas = array();
        while ($campo = $resultado->fetch_field()) {
            $columnas[] = $campo->name;
        }
        fputcsv($fp, $columnas);



        // Filas
        while ($fila = $resultado->fetch_assoc()) {
            fputcsv($fp, $fila);
        }

        $columnas2 = array();
        while ($campo = $resultado2->fetch_field()) {
            $columnas2[] = $campo->name;
        }
        fputcsv($fp, $columnas2);

        while ($fila = $resultado2->fetch_assoc()) {
            fputcsv($fp, $fila);
        }

        fclose($fp);

        $this->archivoCSV = $ruta;
        echo  "<p>CSV generado correctamente</p>";

        $this->cerrarConexion();
    }



    public function importarCSV($rutaCSV)
    {
        $this->crearConexion();

        $fp = fopen($rutaCSV, "r");

        $todasLasFilas = [];
        while (($fila = fgetcsv($fp, 0, ",")) !== false) {
            $todasLasFilas[] = $fila;
        }
        fclose($fp);

        // Preparar statements
        $stmtUsuarios = $this->db->prepare(
            "INSERT INTO Usuarios (id_usuario, profesion, edad, genero, pericia_informatica)
         VALUES (?, ?, ?, ?, ?)"
        );

        $stmtTest = $this->db->prepare(
            "INSERT INTO Test_Usabilidad (id_usuario, dispositivo, tiempo_segundos, tarea_completada, comentarios_usuario, propuestas_mejora, valoracion)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
        );

        $stmtObs = $this->db->prepare(
            "INSERT INTO Observaciones_Facilitador (id_usuario, comentarios)
         VALUES (?, ?)"
        );

        $stmtRespuesta = $this->db->prepare(
            "INSERT INTO Respuestas_Test (id_usuario, numero_pregunta, respuesta)
         VALUES (?, ?, ?)"
        );

        $idUsuarioActual = null;
        $columnaRespuestasSinPasar = true; // Para saltar la primera fila de encabezados cuando hay 2 columnas

        for ($indiceFila = 1; $indiceFila < count($todasLasFilas); $indiceFila++) {
            $fila = $todasLasFilas[$indiceFila];

            // Contar cuántas columnas tienen datos (no vacías)
            $columnasConDatos = 0;
            foreach ($fila as $valor) {
                if (isset($valor) && $valor !== "") {
                    $columnasConDatos++;
                }
            }

            if ($columnasConDatos > 3) {
                $idUsuarioActual = $fila[0];

                $stmtUsuarios->bind_param(
                    "isisi",
                    $fila[0],
                    $fila[1],
                    $fila[2],
                    $fila[3],
                    $fila[4]
                );
                $stmtUsuarios->execute();

                $stmtTest->bind_param(
                    "isiissi",
                    $fila[0],
                    $fila[5],
                    $fila[6],
                    $fila[7],
                    $fila[8],
                    $fila[9],
                    $fila[10]
                );
                $stmtTest->execute();


                $stmtObs->bind_param("is", $fila[0], $fila[11]);
                $stmtObs->execute();


                $columnaRespuestasSinPasar = true;
            } elseif ($columnasConDatos == 3) {
                if ($columnaRespuestasSinPasar) {
                    $columnaRespuestasSinPasar = false;
                    continue;
                }
                $idUsuarioActual = $fila[0];
                $numeroPregunta = $fila[1];
                $respuesta = $fila[2];

                if (isset($respuesta) && $respuesta !== "") {
                    $stmtRespuesta->bind_param(
                        "iis",
                        $idUsuarioActual,
                        $numeroPregunta,
                        $respuesta
                    );
                    $stmtRespuesta->execute();
                }
            }
        }

        $stmtUsuarios->close();
        $stmtTest->close();
        $stmtObs->close();
        $stmtRespuesta->close();

        echo "<p>Importación finalizada.</p>";

        $this->cerrarConexion();
    }
}
