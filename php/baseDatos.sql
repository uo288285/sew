CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    profesion VARCHAR(150) NOT NULL,
    edad INT NOT NULL,
    genero VARCHAR(50) NOT NULL,
    pericia_informatica INT NOT NULL,
    CHECK (edad > 0),
    CHECK (pericia_informatica BETWEEN 0 AND 10)
);

CREATE TABLE IF NOT EXISTS Test_Usabilidad (
    id_usuario INT PRIMARY KEY,
    dispositivo ENUM('ordenador', 'tableta', 'telefono') NOT NULL,
    tiempo_segundos INT NOT NULL DEFAULT 0,
    tarea_completada BOOLEAN NOT NULL DEFAULT 0,
    comentarios_usuario TEXT,
    propuestas_mejora TEXT,
    valoracion INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    CHECK (tiempo_segundos >= 0),
    CHECK (valoracion BETWEEN 0 AND 10)
);

CREATE TABLE IF NOT EXISTS Observaciones_Facilitador (
    id_usuario INT PRIMARY KEY,
    comentarios TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Test_Usabilidad(id_usuario)
);

CREATE TABLE IF NOT EXISTS Respuestas_Test (
    id_usuario INT PRIMARY KEY,
    respuesta_1 TEXT NOT NULL,
    respuesta_2 TEXT NOT NULL,
    respuesta_3 TEXT NOT NULL,
    respuesta_4 TEXT NOT NULL,
    respuesta_5 TEXT NOT NULL,
    respuesta_6 TEXT NOT NULL,
    respuesta_7 TEXT NOT NULL,
    respuesta_8 TEXT NOT NULL,
    respuesta_9 TEXT NOT NULL,
    respuesta_10 TEXT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Test_Usabilidad(id_usuario)
);
