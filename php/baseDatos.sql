CREATE DATABASE IF NOT EXISTS UO288285_DB 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

USE UO288285_DB;

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
    tiempo_segundos INT NOT NULL,
    tarea_completada BOOLEAN NOT NULL,
    comentarios_usuario TEXT,
    propuestas_mejora TEXT,
    valoracion INT NOT NULL,
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
    id_usuario INT NOT NULL,
    numero_pregunta INT NOT NULL,
    respuesta TEXT NOT NULL,
    PRIMARY KEY (id_usuario, numero_pregunta),
    FOREIGN KEY (id_usuario) REFERENCES Test_Usabilidad(id_usuario)

);

