<?php

class Configuracion
{
    private $servername;
    private $username;
    private $password;
    private $nombreDB;
    private $db;
    public $archivoCSV = ""; // Ruta del CSV generado
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
                    echo  "<p>ERROR ejecutando: $query<br>" . $this->db->error . "</p>";
                }
                $query = "";
            }
        }
    }





    public function crearNuevaBD()
    {
        $this->db = new mysqli($this->servername, $this->username, $this->password);
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
        echo "<form method='post'>
                <p>Identificador de usuario</p>
                <p><input type='text' name='identificador'/></p>

                <p>Género</p>
            <p>
                <input type='radio' name='genero' value='Hombre'/>Hombre
                <input type='radio' name='genero' value='Mujer'/>Mujer         
            </p>

                <p>Profesión</p>
                <p><input type='text' name='profesion'/></p>

                <p>Edad</p>
                <p><input type='text' name='edad'/></p>

                <p>Pericia informática</p>
                <p><input type='text' name='pericia'/></p>

                <p>Dispositivo</p>
            <p>
                <input type='radio' name='dispositivo' value='ordenador'/>Ordenador
                <input type='radio' name='dispositivo' value='tableta'/>Tableta
                <input type='radio' name='dispositivo' value='telefono'/>Telefono          
            </p>

                <p><input type='submit' name='nuevoUsuario' value='Enviar a base de datos'></p>
                </form>";
    }

    public function insertarParticipante()
    {
        $this->crearConexion();

        $sql = "INSERT INTO usuarios (id_usuario, genero, profesion, edad, pericia_informatica) 
            VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            echo "<p>Error en prepare: " . $this->db->error . "</p>";
            return;
        }

        $this->idActual = $_POST["identificador"];
        $id = $this->idActual;
        $genero = $_POST["genero"] ?? "";
        $profesion = $_POST["profesion"];
        $edad = $_POST["edad"];
        $pericia = $_POST["pericia"];

        $stmt->bind_param("issii", $id, $genero, $profesion, $edad, $pericia);

        if ($stmt->execute()) {
            echo "<p>Usuario insertado correctamente</p>";
        } else {
            echo "<p>Error al insertar: " . $stmt->error . "</p>";
        }

        $stmt->close();
        $this->cerrarConexion();
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
        $dispositivo = $_POST["dispositivo"] ?? "";

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







    /* =====================================================
       EXPORTAR CSV SIN BORRAR EL FORMULARIO
       =====================================================*/
    public function exportarCSV()
    {
        $this->crearConexion();

        $sql = file_get_contents("consultaExportarDatos.sql");
        $resultado = $this->db->query($sql);

        if (!$resultado) {
            echo "<p>Error al ejecutar la consulta: " . $this->db->error . "</p>";
            return;
        }

        $nombre = "export_" . date("Ymd_His") . ".csv";
        $ruta = "csv/" . $nombre;

        if (!is_dir("csv")) mkdir("csv");

        $fp = fopen($ruta, "w");

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

        fclose($fp);

        $this->archivoCSV = $ruta;
        echo  "<p>CSV generado correctamente en '$ruta'</p>";

        $this->cerrarConexion();
    }
}
