-- ══════════════════════════════════════════════════════
-- MYTEACHER — Script de base de datos
-- MySQL 8.0
-- ══════════════════════════════════════════════════════
 
CREATE DATABASE IF NOT EXISTS myteacher
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
 
USE myteacher;
 
-- ══════════════════════════════════════════════════════
-- TABLA: usuarios
-- Base compartida para estudiantes y tutores
-- ══════════════════════════════════════════════════════
CREATE TABLE usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100)  NOT NULL,
  correo        VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  rol           ENUM('estudiante', 'tutor') NOT NULL,
  foto_perfil   VARCHAR(255)  DEFAULT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 
-- ══════════════════════════════════════════════════════
-- TABLA: estudiantes
-- Info extra del estudiante
-- ══════════════════════════════════════════════════════
CREATE TABLE estudiantes (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT          NOT NULL UNIQUE,
  nivel_educativo ENUM('Primaria', 'Bachillerato', 'Universitario') NOT NULL DEFAULT 'Universitario',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
 
-- ══════════════════════════════════════════════════════
-- TABLA: tutores
-- Info extra del tutor
-- ══════════════════════════════════════════════════════
CREATE TABLE tutores (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT           NOT NULL UNIQUE,
  descripcion     TEXT          DEFAULT NULL,
  precio_hora     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  modalidad       ENUM('Virtual', 'Presencial', 'Virtual/Presencial') NOT NULL DEFAULT 'Virtual',
  ubicacion       VARCHAR(100)  DEFAULT NULL,
  calificacion    DECIMAL(3,2)  DEFAULT 0.00,
  total_resenas   INT           DEFAULT 0,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
 
-- ══════════════════════════════════════════════════════
-- TABLA: materias
-- Catálogo de materias disponibles
-- ══════════════════════════════════════════════════════
CREATE TABLE materias (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);
 
-- ══════════════════════════════════════════════════════
-- TABLA: tutor_materias
-- Relación muchos a muchos: tutor puede dar varias materias
-- ══════════════════════════════════════════════════════
CREATE TABLE tutor_materias (
  tutor_id   INT NOT NULL,
  materia_id INT NOT NULL,
  PRIMARY KEY (tutor_id, materia_id),
  FOREIGN KEY (tutor_id)   REFERENCES tutores(id)  ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);
 
-- ══════════════════════════════════════════════════════
-- TABLA: disponibilidad
-- Horarios disponibles del tutor por día
-- ══════════════════════════════════════════════════════
CREATE TABLE disponibilidad (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  tutor_id   INT         NOT NULL,
  dia        ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NOT NULL,
  hora_inicio TIME        NOT NULL,
  hora_fin    TIME        NOT NULL,
  FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE
);
 
-- ══════════════════════════════════════════════════════
-- TABLA: reservas
-- Reservas hechas por estudiantes a tutores
-- ══════════════════════════════════════════════════════
CREATE TABLE reservas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id  INT       NOT NULL,
  tutor_id       INT       NOT NULL,
  materia_id     INT       NOT NULL,
  fecha          DATE      NOT NULL,
  hora           TIME      NOT NULL,
  modalidad      ENUM('Virtual', 'Presencial') NOT NULL,
  estado         ENUM('Próxima', 'Activa', 'Completada', 'Cancelada') NOT NULL DEFAULT 'Próxima',
  enlace_clase   VARCHAR(255) DEFAULT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id)      REFERENCES tutores(id)     ON DELETE CASCADE,
  FOREIGN KEY (materia_id)    REFERENCES materias(id)    ON DELETE RESTRICT
);
 
-- ══════════════════════════════════════════════════════
-- TABLA: reseñas
-- Calificaciones y comentarios de estudiantes a tutores
-- ══════════════════════════════════════════════════════
CREATE TABLE resenas (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  reserva_id     INT           NOT NULL UNIQUE,
  estudiante_id  INT           NOT NULL,
  tutor_id       INT           NOT NULL,
  calificacion   TINYINT       NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario     TEXT          DEFAULT NULL,
  created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reserva_id)    REFERENCES reservas(id)    ON DELETE CASCADE,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id)      REFERENCES tutores(id)     ON DELETE CASCADE
);
 
-- ══════════════════════════════════════════════════════
-- TRIGGER: actualizar calificación promedio del tutor
-- Se ejecuta después de insertar una reseña
-- ══════════════════════════════════════════════════════
DELIMITER $$
 
CREATE TRIGGER actualizar_calificacion_tutor
AFTER INSERT ON resenas
FOR EACH ROW
BEGIN
  UPDATE tutores
  SET
    calificacion  = (SELECT AVG(calificacion) FROM resenas WHERE tutor_id = NEW.tutor_id),
    total_resenas = (SELECT COUNT(*)          FROM resenas WHERE tutor_id = NEW.tutor_id)
  WHERE id = NEW.tutor_id;
END$$
 
DELIMITER ;
 
-- ══════════════════════════════════════════════════════
-- DATOS DE PRUEBA
-- ══════════════════════════════════════════════════════
 
-- Materias
INSERT INTO materias (nombre) VALUES
  ('Matematicas'),
  ('Física'),
  ('Química'),
  ('Inglés'),
  ('Coreano'),
  ('Historia'),
  ('Álgebra'),
  ('Cálculo');
 
-- Usuarios (password = 'test1234' hasheado con bcrypt como placeholder)
INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES
  ('Tung Tung Sahur',       'estudiante@gmail.com',  '$2b$10$placeholder_hash_estudiante', 'estudiante'),
  ('Ana Gomez',             'ana@gmail.com',          '$2b$10$placeholder_hash_ana',        'estudiante'),
  ('Juan Perez',            'tutor@gmail.com',        '$2b$10$placeholder_hash_tutor',      'tutor'),
  ('Laura Diaz',            'laura@gmail.com',        '$2b$10$placeholder_hash_laura',      'tutor'),
  ('Lionel Messi',          'messi@gmail.com',        '$2b$10$placeholder_hash_messi',      'tutor'),
  ('Maria Jose Fernandez',  'maria@gmail.com',        '$2b$10$placeholder_hash_maria',      'tutor');
 
-- Estudiantes
INSERT INTO estudiantes (usuario_id, nivel_educativo) VALUES
  (1, 'Universitario'),
  (2, 'Universitario');
 
-- Tutores
INSERT INTO tutores (usuario_id, descripcion, precio_hora, modalidad, ubicacion) VALUES
  (3, 'Profesor de matemáticas con 5 años de experiencia ayudando a estudiantes universitarios y de secundaria.', 20.00, 'Virtual/Presencial', 'Barranquilla'),
  (4, 'Tutora de historia y humanidades con enfoque en pensamiento crítico.', 25.00, 'Presencial',         'Barranquilla'),
  (5, 'Experto en matemáticas avanzadas y álgebra lineal.',                   40.00, 'Virtual/Presencial', 'Barranquilla'),
  (6, 'Profesora nativa de coreano con certificación TOPIK.',                 45.00, 'Virtual',            'Barranquilla');
 
-- Materias por tutor
INSERT INTO tutor_materias (tutor_id, materia_id) VALUES
  (1, 1), (1, 7), (1, 8),  -- Juan: Matematicas, Álgebra, Cálculo
  (2, 6),                   -- Laura: Historia
  (3, 1), (3, 7),           -- Messi: Matematicas, Álgebra
  (4, 5);                   -- Maria: Coreano
 
-- Disponibilidad
INSERT INTO disponibilidad (tutor_id, dia, hora_inicio, hora_fin) VALUES
  (1, 'Lunes',      '15:00:00', '19:00:00'),
  (1, 'Martes',     '14:00:00', '18:00:00'),
  (1, 'Miércoles',  '16:00:00', '20:00:00'),
  (2, 'Lunes',      '09:00:00', '13:00:00'),
  (2, 'Jueves',     '14:00:00', '18:00:00'),
  (3, 'Martes',     '10:00:00', '14:00:00'),
  (3, 'Viernes',    '15:00:00', '19:00:00'),
  (4, 'Lunes',      '08:00:00', '12:00:00'),
  (4, 'Miércoles',  '14:00:00', '18:00:00');
 
-- Reservas
INSERT INTO reservas (estudiante_id, tutor_id, materia_id, fecha, hora, modalidad, estado) VALUES
  (1, 3, 1, '2026-03-12', '16:00:00', 'Presencial', 'Completada'),
  (1, 2, 6, '2026-03-04', '14:00:00', 'Presencial', 'Completada'),
  (1, 3, 1, '2026-03-15', '16:00:00', 'Virtual',    'Próxima'),
  (2, 1, 1, '2026-03-12', '16:00:00', 'Virtual',    'Próxima'),
  (1, 4, 5, '2026-03-15', '18:00:00', 'Virtual',    'Próxima');
 
-- Reseñas
INSERT INTO resenas (reserva_id, estudiante_id, tutor_id, calificacion, comentario) VALUES
  (1, 1, 3, 5, 'El tutor explica muy bien y tiene mucha paciencia.'),
  (2, 1, 2, 5, 'La clase fue clara y resolvió todas mis dudas.');
