SELECT 
    u.id_usuario,
    u.profesion,
    u.edad,
    u.genero,
    u.pericia_informatica,

    t.dispositivo,
    t.tiempo_segundos,
    t.tarea_completada,
    t.comentarios_usuario,
    t.propuestas_mejora,
    t.valoracion,

    o.comentarios AS comentarios_facilitador,

    r.respuesta_1,
    r.respuesta_2,
    r.respuesta_3,
    r.respuesta_4,
    r.respuesta_5,
    r.respuesta_6,
    r.respuesta_7,
    r.respuesta_8,
    r.respuesta_9,
    r.respuesta_10

FROM Usuarios u
LEFT JOIN Test_Usabilidad t ON u.id_usuario = t.id_usuario
LEFT JOIN Observaciones_Facilitador o ON u.id_usuario = o.id_usuario
LEFT JOIN Respuestas_Test r ON u.id_usuario = r.id_usuario
ORDER BY u.id_usuario;
