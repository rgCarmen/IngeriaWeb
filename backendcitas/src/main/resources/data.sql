INSERT INTO usuario (contrasena, email, rol) 
VALUES ('749146993', 'paciente@example.com', 'PACIENTE'), --contraseña paciente
('92668751', 'admin@example.com', 'ADMINISTRADOR'),--admin
('-1078031031',	'medico@example.com', 'MEDICO'); --medico 

INSERT INTO PACIENTE (nombre, apellidos, dni, telefono, usuario_id) VALUES
 ('Ana', 'García Rodríguez', '98765432B', '698765432', 1);

INSERT INTO MEDICO (nombre, apellidos, especialidad, telefono, usuario_id) VALUES
 ('Elena', 'López García', 'Cardiología', '611111111', 3);


INSERT INTO CITA (FECHA, MEDICO_ID, PACIENTE_ID, DESCRIPCION, TIPO_CITA)
VALUES
    ('2024-12-06 12:00:00', 1, 1, 'cardiologia', 'CONSULTA'),
    ('2024-12-07 09:30:00', 1, 1, 'traumatologia', 'CONSULTA'),
    ('2024-12-08 11:15:00', 1, 1, 'medicina general', 'CONSULTA'),
    ('2024-12-09 10:00:00', 1, 1, 'nutricion', 'CONSULTA'),
    ('2024-12-10 15:45:00', 1, 1, 'cardiologia', 'CONSULTA');

INSERT INTO CITA (FECHA, MEDICO_ID, PACIENTE_ID, DESCRIPCION, TIPO_CITA)
VALUES
    ('2024-12-11 12:00:00', 1, NULL, 'cardiologia', 'CONSULTA'),
    ('2024-12-11 09:30:00', 1, NULL, 'cardiologia', 'CONSULTA');

INSERT INTO notificaciones (usuario_id, mensaje, fechaEnvio) VALUES
(1, 'Tu próxima cita médica está programada para el 2024-12-20 a las 10:00 AM.', '2024-12-16 10:00:00'),
(1, 'Tu próxima cita médica está programada para el 2024-12-21 a las 11:00 AM.', '2024-12-16 10:05:00'),
(1, 'Tu próxima cita médica está programada para el 2024-12-22 a las 09:00 AM.', '2024-12-16 10:10:00');
