-- ══════════════════════════════════════════════════════
-- TABLAS
-- ══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100)  NOT NULL,
  correo        VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  rol           ENUM('estudiante', 'tutor') NOT NULL,
  foto_perfil   VARCHAR(255)  DEFAULT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estudiantes (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT          NOT NULL UNIQUE,
  nivel_educativo ENUM('Primaria', 'Bachillerato', 'Universitario') NOT NULL DEFAULT 'Universitario',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tutores (
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

CREATE TABLE IF NOT EXISTS materias (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tutor_materias (
  tutor_id   INT NOT NULL,
  materia_id INT NOT NULL,
  PRIMARY KEY (tutor_id, materia_id),
  FOREIGN KEY (tutor_id)   REFERENCES tutores(id)  ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS disponibilidad (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  tutor_id    INT         NOT NULL,
  dia         ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NOT NULL,
  hora_inicio TIME        NOT NULL,
  hora_fin    TIME        NOT NULL,
  FOREIGN KEY (tutor_id) REFERENCES tutores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservas (
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

CREATE TABLE IF NOT EXISTS resenas (
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
-- DATOS DE PRUEBA
-- ══════════════════════════════════════════════════════

INSERT INTO materias (nombre) VALUES
  ('Matematicas'),
  ('Física'),
  ('Química'),
  ('Inglés'),
  ('Coreano'),
  ('Historia'),
  ('Álgebra'),
  ('Cálculo');

INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES
  ('Tung Tung Sahur',       'estudiante@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'estudiante'),
  ('Ana Gomez',             'ana@gmail.com',          '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'estudiante'),
  ('Juan Perez',            'tutor@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tutor'),
  ('Laura Diaz',            'laura@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tutor'),
  ('Lionel Messi',          'messi@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tutor'),
  ('Maria Jose Fernandez',  'maria@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tutor');

INSERT INTO estudiantes (usuario_id, nivel_educativo) VALUES
  (1, 'Universitario'),
  (2, 'Universitario');

INSERT INTO tutores (usuario_id, descripcion, precio_hora, modalidad, ubicacion) VALUES
  (3, 'Profesor de matemáticas con 5 años de experiencia.', 20.00, 'Virtual/Presencial', 'Barranquilla'),
  (4, 'Tutora de historia con enfoque en pensamiento crítico.', 25.00, 'Presencial', 'Barranquilla'),
  (5, 'Experto en matemáticas avanzadas y álgebra lineal.', 40.00, 'Virtual/Presencial', 'Barranquilla'),
  (6, 'Profesora nativa de coreano con certificación TOPIK.', 45.00, 'Virtual', 'Barranquilla');

INSERT INTO tutor_materias (tutor_id, materia_id) VALUES
  (1, 1), (1, 7), (1, 8),
  (2, 6),
  (3, 1), (3, 7),
  (4, 5);

INSERT INTO disponibilidad (tutor_id, dia, hora_inicio, hora_fin) VALUES
  (1, 'Lunes',     '15:00:00', '19:00:00'),
  (1, 'Martes',    '14:00:00', '18:00:00'),
  (1, 'Miércoles', '16:00:00', '20:00:00'),
  (2, 'Lunes',     '09:00:00', '13:00:00'),
  (2, 'Jueves',    '14:00:00', '18:00:00'),
  (3, 'Martes',    '10:00:00', '14:00:00'),
  (3, 'Viernes',   '15:00:00', '19:00:00'),
  (4, 'Lunes',     '08:00:00', '12:00:00'),
  (4, 'Miércoles', '14:00:00', '18:00:00');

INSERT INTO reservas (estudiante_id, tutor_id, materia_id, fecha, hora, modalidad, estado) VALUES
  (1, 3, 1, '2026-03-12', '16:00:00', 'Presencial', 'Completada'),
  (1, 2, 6, '2026-03-04', '14:00:00', 'Presencial', 'Completada'),
  (1, 3, 1, '2026-03-15', '16:00:00', 'Virtual',    'Próxima'),
  (2, 1, 1, '2026-03-12', '16:00:00', 'Virtual',    'Próxima'),
  (1, 4, 5, '2026-03-15', '18:00:00', 'Virtual',    'Próxima');

INSERT INTO resenas (reserva_id, estudiante_id, tutor_id, calificacion, comentario) VALUES
  (1, 1, 3, 5, 'El tutor explica muy bien y tiene mucha paciencia.'),
  (2, 1, 2, 5, 'La clase fue clara y resolvió todas mis dudas.');

-- Actualizar calificaciones manualmente (reemplaza el trigger)
UPDATE tutores SET calificacion = 5.00, total_resenas = 1 WHERE id = 3;
UPDATE tutores SET calificacion = 5.00, total_resenas = 1 WHERE id = 2;
