SELECT 
    U.id_usuario,
    U.profesion,
    U.edad,
    U.genero,
    U.pericia_informatica,

    T.dispositivo,
    T.tiempo_segundos,
    T.tarea_completada,
    T.comentarios_usuario,
    T.propuestas_mejora,
    T.valoracion,

    O.comentarios AS comentarios_facilitador

FROM Usuarios U
LEFT JOIN Test_Usabilidad T 
       ON U.id_usuario = T.id_usuario
LEFT JOIN Observaciones_Facilitador O 
       ON U.id_usuario = O.id_usuario
ORDER BY U.id_usuario;
