--script usado para reinicar la base de datos
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Observaciones_Facilitador;
TRUNCATE TABLE Test_Usabilidad;
TRUNCATE TABLE Respuestas_Test;
TRUNCATE TABLE Usuarios;

SET FOREIGN_KEY_CHECKS = 1;


