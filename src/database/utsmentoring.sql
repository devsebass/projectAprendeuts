-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-02-2024 a las 17:22:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `utsmentoring`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mentorings`
--

CREATE TABLE `mentorings` (
  `id` int(2) NOT NULL,
  `modality` varchar(10) NOT NULL,
  `type` varchar(10) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `location` varchar(40) NOT NULL,
  `subject` varchar(90) NOT NULL,
  `studentId` int(2) NOT NULL,
  `teacherId` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mentorings`
--

INSERT INTO `mentorings` (`id`, `modality`, `type`, `date`, `time`, `location`, `subject`, `studentId`, `teacherId`) VALUES
(57, 'Presencial', 'Grupal', '2024-02-20', '09:00:00', 'Módulo 22 CAE - TEKNÉ (Edificio C)', 'Administración de servidores', 31, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `studentId` int(11) DEFAULT NULL,
  `teacherId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ratings`
--

INSERT INTO `ratings` (`id`, `rating`, `comment`, `studentId`, `teacherId`) VALUES
(9, 2, 'No me gustó como me enseñó', 30, 6),
(13, 4, 'Buen profesor, resolvió mis dudas.', 31, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `students`
--

CREATE TABLE `students` (
  `id` int(5) NOT NULL,
  `doc_type` varchar(35) NOT NULL,
  `doc_number` varchar(35) NOT NULL,
  `name` varchar(120) NOT NULL,
  `lastname` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(125) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `gender` varchar(20) NOT NULL,
  `token` varchar(55) DEFAULT NULL,
  `expired` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `students`
--

INSERT INTO `students` (`id`, `doc_type`, `doc_number`, `name`, `lastname`, `email`, `password`, `image`, `gender`, `token`, `expired`) VALUES
(30, 'Cedula de Ciudadanía', '1004858458', 'Joana', 'Torres Gomez', 'joanat@uts.edu.co', '$2b$12$0lWQ3sId.4rKPWj18dX6buij/DNOxPRZs7EsW3okFPnVskB155KKi', 'image-1707015452747.svg', 'Femenino', NULL, NULL),
(31, 'Cédula de Ciudadanía', '1005163589', 'Joan Sebastian', 'Delgado Cuadros', 'joansdelgado@uts.edu.co', '$2b$12$QKF/TZcHlfJTHVyKzsic3ulaxlWiiUs71kVWr1JR9QmS6SCIvNJXe', 'image-1707015468443.svg', 'Masculino', NULL, NULL),
(32, 'Cédula de Ciudadanía', '234343', 'Sara', 'Mendieta', 'sara@uts.edu.co', '$2b$12$fR6Rs.6WyHoR1cDHrMvfpOAFpHuedz5/lN555xWflXIc2xipUpYCS', 'image-1707015482024.svg', 'Otro', NULL, NULL),
(60, 'Registro Cívil', '45454545', 'Juan Carlos', 'Perez Doa', 'juanc@uts.edu.co', '$2b$12$yvr7tOke37Z32ZJ0hv4RMOr1yDGR0VAWLywd6zsCM3OgkC3DbXD8y', '/image-1707015482024.svg', 'Otro', NULL, NULL),
(61, 'Cédula de Ciudadanía', '1005163748', 'Maria Jose', 'Rojas Diaz', 'mjose@uts.edu.co', '$2b$12$zHCr2t/pjWr7k/GtvvZd2.6ANFpFR41mRD7W9CyQmcQo2n9NQYfqu', '/image-1707015452747.svg', 'Femenino', NULL, NULL),
(62, 'Cédula de Ciudadanía', '1023929438', 'Matias', 'Rodriguez', 'mrodriguez@uts.edu.co', '$2b$12$BgfJLLsrVhfUC6WqX4CuT.oiPIAl2fWJ4bDiZGaXpJdMSocVLjl0S', '/image-1707015468443.svg', 'Masculino', NULL, NULL),
(63, 'Cédula de Ciudadanía', '1095596592', 'Maria', 'Dominguez Cardona', 'mdominguez@uts.edu.co', '$2b$12$IDyXn6WJtjMuceRU0ENqfOMRJ3l8mpMBRU/UoWaH.twVrG0ZDkWaq', '/image-1707015452747.svg', 'Femenino', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subjects`
--

CREATE TABLE `subjects` (
  `id` varchar(6) NOT NULL,
  `name` varchar(90) NOT NULL,
  `disponibility` varchar(60) NOT NULL,
  `modality` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `disponibility`, `modality`) VALUES
('TSI001', 'Pensamiento algorítmico', 'Lunes - Miércoles', 'Presencial - Virtual'),
('TSI005', 'Estructura de computadores', 'Viernes', 'Presencial - Virtual'),
('TSI00S', 'Desarrollo de videojuegos', 'Lunes - Martes', 'Presencial - Virtual'),
('TSI102', 'Matemáticas discretas', 'Martes - Jueves', 'Presencial - Virtual'),
('TSI203', 'Fundamentos de POO', 'Miércoles - Jueves - Viernes', 'Presencial - Virtual'),
('TSI204', 'Diseño de base de datos', 'Lunes - Jueves', 'Presencial - Virtual'),
('TSI301', 'Motores de base de datos', 'Jueves', 'Presencial - Virtual'),
('TSI302', 'Programación orientada a objetos', 'Lunes', 'Presencial - Virtual'),
('TSI305', 'Programación de dispositivos', 'Martes', 'Presencial - Virtual'),
('TSI401', 'Programación web', 'Martes - Miércoles', 'Presencial - Virtual'),
('TSI402', 'Administración de servidores', 'Lunes - Jueves', 'Presencial - Virtual'),
('TSI503', 'Estructura de datos', 'Martes - Viernes', 'Presencial - Virtual'),
('TSI512', 'Redes', 'Lunes - Jueves - Viernes', 'Presencial - Virtual'),
('TSI513', 'Aplicaciones móviles', 'Miércoles', 'Presencial - Virtual'),
('TSI600', 'Desarrollo de aplicaciones empresariales', 'Jueves - Viernes', 'Presencial - Virtual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teachers`
--

CREATE TABLE `teachers` (
  `id` int(2) NOT NULL,
  `name` varchar(90) NOT NULL,
  `lastname` varchar(90) NOT NULL,
  `email` varchar(129) NOT NULL,
  `description` varchar(250) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `subjectId` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `teachers`
--

INSERT INTO `teachers` (`id`, `name`, `lastname`, `email`, `description`, `image`, `subjectId`) VALUES
(1, 'Ernesto', 'Solano', 'esolano@correo.uts.edu.co', 'Docente de Administración de servidores con 20 años de experiencia y 20 años en las UTS.', 'image-1707018048000.jpg', 'TSI402'),
(2, 'Carlos', 'Carrascal', 'calbertocarrascal@correo.uts.edu.co', 'Docente de Aplicaciones móviles con 1 año de \r\nexperiencia y 1 año en las UTS.', 'image-1707018069292.jpg', 'TSI513'),
(3, 'Julian', 'Jaimes', 'jbjaimes@correo.uts.edu.co', 'Docente de Desarrollo de Aplicaciones Empresariales con 10 años de \r\nexperiencia y 2 años en las UTS.', 'image-1707018085379.jpg', 'TSI600'),
(4, 'Alexandar', 'Anchicoque', 'aanchicoque@correo.uts.edu.co', 'Docente de Desarrollo de videojuegos con 10 años de \r\nexperiencia y 5 años en las UTS.', 'image-1707018751821.jpg', 'TSI00S'),
(5, 'Ruben', 'Fontecha', 'rfontecha@correo.uts.edu.co', 'Docente de Motores de bases de datos con 23 años de experiencia y 23 años en las UTS.', 'image-1707018794972.jpg', 'TSI301'),
(6, 'Laura', 'Duarte', 'lauraduarte@correo.uts.edu.co', 'Docente de Diseño de bases de datos con 11 años de experiencia y 11 años en las UTS.', 'image-1707018820153.jpg', 'TSI204'),
(7, 'Wilson', 'Castaño', 'wilsonc@correo.uts.edu.co', 'Docente de Estructura de computadores con 22 años de experiencia y 2 años en las UTS.', 'image-1707018876971.jpg', 'TSI005'),
(8, 'Oscar', 'Monsalve', 'omonsalve@correo.uts.edu.co', 'Docente de Redes con 2 años de experiencia y 2 años en las UTS.', 'image-1707018901123.jpg', 'TSI512'),
(9, 'Eliécer', 'Montero', 'emontero@correo.uts.edu.co', 'Docente de Estructura de datos con 24 años de experiencia y 4 años en las UTS.', 'image-1707019004396.jpg', 'TSI503'),
(10, 'Leidy', 'Polo', 'lpolo@correo.uts.edu.co', 'Docente de Programación orientada a objetos con 16 años de experiencia y 10 años en las UTS.', 'image-1707018923081.jpg', 'TSI302'),
(11, 'Olga', 'Monroy', 'omonroy@correo.uts.edu.co', 'Docente de Fundamentos de POO con 26 años de experiencia y 6 años en las UTS.', 'image-1707019097202.jpg', 'TSI203'),
(12, 'Néstor', 'Anaya', 'nanaya@correo.uts.edu.co', 'Docente de Matemáticas discretas con 19 años de experiencia y 19 años en las UTS.', 'image-1707019040111.jpg', 'TSI102'),
(13, 'Adriana', 'Leal', 'aleal@correo.uts.edu.co', 'Docente de Pensamiento algorítmico con 20 años de experiencia y 20 años en las UTS.', 'image-1707019139157.jpg', 'TSI001'),
(14, 'Javier', 'Ardila', 'aleal@correo.uts.edu.co', 'Docente de Programación de dispositivos con 18 años de experiencia y 4 años en las UTS.', 'image-1707154115620.jpg', 'TSI305'),
(15, 'Víctor', 'Ochoa', 'victorochoa@correo.uts.edu.co', 'Docente de Programación web con 13 años de experiencia y 3 años en las UTS.', 'image-1707019170930.jpg', 'TSI401');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `mentorings`
--
ALTER TABLE `mentorings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mentorings_students` (`studentId`),
  ADD KEY `fk_mentorings_teacher` (`teacherId`);

--
-- Indices de la tabla `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `teacherId` (`teacherId`);

--
-- Indices de la tabla `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_teacher_subject` (`subjectId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `mentorings`
--
ALTER TABLE `mentorings`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `students`
--
ALTER TABLE `students`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT de la tabla `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mentorings`
--
ALTER TABLE `mentorings`
  ADD CONSTRAINT `fk_mentorings_students` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `fk_mentorings_teacher` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`);

--
-- Filtros para la tabla `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`);

--
-- Filtros para la tabla `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `fk_teacher_subject` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`);

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`localhost` EVENT `delete_mentorings` ON SCHEDULE EVERY 1 HOUR STARTS '2024-02-01 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    SET @current_datetime = NOW();

    DELETE FROM mentorings
    WHERE `date` <= CURRENT_DATE
      AND `time` <= CURRENT_TIME
      AND TIMESTAMPDIFF(SECOND, TIMESTAMP(CONCAT(`date`, ' ', `time`)), @current_datetime) >= 3600;
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
