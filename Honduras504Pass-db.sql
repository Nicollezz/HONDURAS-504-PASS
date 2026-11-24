CREATE DATABASE Honduras504Pass;

USE Honduras504Pass;

CREATE TABLE Rol_Usuario (
	id_rol_usuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
    nombre_rol VARCHAR(100) NOT NULL
);

INSERT  INTO Rol_Usuario (id_rol_usuario,nombre_rol) 
VALUES                   (1,'ADMINISTRADOR'),
						 (2,'OPERADOR DE RUTA 1'),
                         (3,'USUARIO');
CREATE TABLE PERSONA(
    id_persona INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(200) UNIQUE NOT NULL,
    telefono VARCHAR(12) NOT NULL,
    fecha_nacimiento DATETIME NOT NULL,
    fecha_registro DATETIME NOT NULL,
    estado_cuenta BOOLEAN NOT NULL
);

INSERT INTO Persona (id_persona,nombre,apellido,correo_electronico,telefono,fecha_nacimiento,fecha_registro,estado_cuenta) 
VALUES				(1,'Cristhian Mauricio','Castañeda Bean','casta0124@gmail.com','99261920','1996-04-01','2026-11-22',TRUE),
					(2,'Alessandra Munson','Martinez Orellana','alexmun1455@gmail.com','98671436','2001-06-11','2026-10-10',TRUE),
                    (3,'Edgardo Francisco','Muñoz Hernandes','edgar_her99@yahoo.com','89146825','1999-09-30','2026-09-14',TRUE),
                    (4,'Elvis Roberto','Lopez Garcia','elvis_lopez78@hotmail.com','84256842','1978-10-01','2026-12-01',TRUE),
                    (5,'Brandon Garcia','Caceres Gomez','brangomez01@icloud.com','95358468','1973-08-01','2026-11-16',TRUE),
                    (6,'Yeirin Maria','Perdomo Hernandez','yemary42@yahoo.com','99657528','1989-08-01','2026-04-16',TRUE),
                    (7,'Susana Padilla','Morales Kattan','susykattan12@gmail.com','96483515','2001-03-14','2026-10-07',TRUE),
                    (8,'Pablo Jacobo','Paz Reyes','p_reyes@icloud.com','97584284','2002-10-09','2026-08-27',TRUE),
                    (9,'Gustavo Josue','Montoya Matute','josue_monty69@hotmail.es','99483258','1991-12-31','2026-10-16',TRUE),
                    (10,'Jimmy Ariel','Casco Lainez','jim_lainez@gmail.es','98568425','1997-05-12','2026-08-23',TRUE);

CREATE TABLE Administrador (
	id_admin INT PRIMARY KEY NOT NULL AUTO_INCREMENT,

	id_rol_usuario INT NOT NULL,
    FOREIGN KEY (id_rol_usuario)
    REFERENCES Rol_Usuario(id_rol_usuario),
    
    id_persona INT NOT NULL,
	FOREIGN KEY(id_persona)
	REFERENCES Persona(id_persona)
);

INSERT INTO Administrador (id_admin,id_rol_usuario,id_persona) 
VALUES					  (1,1,1),
						  (2,1,2),
                          (3,1,3);

CREATE TABLE Usuario (
	id_usuario INT PRIMARY KEY 
    AUTO_INCREMENT NOT NULL,
    
	id_rol_usuario INT NOT NULL,
    FOREIGN KEY (id_rol_usuario)
    REFERENCES Rol_Usuario(id_rol_usuario),
    
    id_persona INT NOT NULL,
	FOREIGN KEY(id_persona)
	REFERENCES Persona(id_persona)
);

INSERT INTO Usuario (id_usuario,id_rol_usuario,id_persona) 
VALUES				(1,3,4),
					(2,3,5),
					(3,3,6);

CREATE TABLE Destino (
	id_destino INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    punto_partida VARCHAR(200) NOT NULL,
    punto_llegada VARCHAR(200) NOT NULL,
    departamento  VARCHAR(200) NOT NULL,
    municipio     VARCHAR(200) NOT NULL,
    tiempo_ruta TIME NOT NULL,
    terminal VARCHAR(200) NOT NULL
);

INSERT INTO Destino (id_destino,punto_partida,punto_llegada,departamento,municipio,tiempo_ruta,terminal) 
VALUES				(1,'Las Brisas-Expocentro','City Mall','Cortes','San Pedro Sula','00:45:00','Terminal Las Brisas- Expocentro'),
					(2,'City Mall','LAS BRISAS-EXPOCENTRO','Cortes','San Pedro Sula','01:00:00','Terminal City Mall'),
                    (3,'Barandillas','Bo.Centro','Cortes','San Pedro Sula','00:30:00','Terminal Barandillas'),
                    
                    (4,'Bo. Morazan','Mall Premier','Francisco Morazan','Distrito Central','01:30:00','Terminal Morazan'),
                    (5,'Col. Los Profesores ','Francisco Morazan','Distrito Central','00:30:00','Terminal Los Profesores'),
                    (6,'Col. Hato de Enmedio','Francisco Morazan','Distrito Central','01:45:00','Terminal Hato de Enmedio'),
                    
                    (7,'Bo. Alvarado','Bo. Sierra Pina','Atlantida','La Ceiba','02:00:00','Terminal Alvarado'),
                    (8,'Bo. San Jose','Bo. Ingles','Atlantida','La Ceiba','01:15:00','Terminal San Jose'),
                    (10,'Bo. Buenos Aires','Bo. Bella Vista','Atlantida','La Ceiba','00:45:00','Terminal Buenos Aires'),
					
                    (10,'Bo. Las Delicias','Bo. El Batey','Valle','Amapala','02:00:00','Terminal Las Delicias');

CREATE TABLE Ruta(
     id_ruta INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
     nombre_ruta VARCHAR(100) NOT NULL,
     rutas_activas BOOLEAN NOT NULL
);

INSERT INTO Ruta (id_ruta,nombre_ruta,rutas_activas) 
VALUES			 (1,'RUTA NORTE',TRUE),
				 (2,'RUTA OCCIDENTE',TRUE),
				 (3,'RUTA INDUSTRIAL',TRUE),
				 (4,'RUTA METROPOLITANA',TRUE),
				 (5,'RUTA SUR',FALSE),
				 (6,'RUTA CENTRAL',FALSE),
				 (8,'RUTA ATLANTICO',TRUE),
                 (9,'RUTA ORIENTAL',TRUE),
                 (10,'RUTA CRISTINA',TRUE);

CREATE TABLE Horario (
	id_horario INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    precio DECIMAL(10,2) NOT NULL,
    estado_servicio VARCHAR(100) NOT NULL,
    fecha_laboral DATE NOT NULL,
    
    id_admin INT NOT NULL,  
    FOREIGN KEY(id_admin) 
    REFERENCES Administrador(id_admin),
    
    id_destino INT NOT NULL,
    FOREIGN KEY(id_destino)
    REFERENCES Destino(id_destino),
    
    id_ruta INT NOT NULL,
    FOREIGN KEY(id_ruta)
    REFERENCES Ruta(id_ruta)
);

-- Crear table estado_servicio para asignar en CURSO , RETRASADA, CANCELADA, PENDIENTE, COMPLETADA--
INSERT INTO Horario(id_horario,precio,estado_servicio,fecha_laboral,id_admin,id_destino,id_ruta) 
VALUES			   (1,125,'EN CURSO',  '22-11-22',1,1,10),
				   (2,155,'RETRASADA', '22-11-22',3,9,2),
				   (3,75,'EN CURSO',   '22-11-22',2,7,1),
				   (4,200,'CANCELADA', '22-11-22',3,8,9),
				   (5,160,'PENDIENTE', '22-11-22',1,5,3),
				   (6,150,'COMPLETADO','22-11-22',2,6,8),
				   (7,125,'EN CURSO',  '22-11-22',3,4,4),
				   (8,50,'EN CURSO',   '22-11-22',2,3,6),
				   (9,14,'EN CURSO',   '22-11-22',2,2,7),
				   (10,14,'EN CURSO',  '22-11-22',3,10,5);

CREATE TABLE Unidad_Transporte (
	id_unidad INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    empresa VARCHAR(200) NOT NULL,
    placa VARCHAR(15) NOT NULL,
    capacidad INT NOT NULL
);

INSERT INTO Unidad_Transporte(id_unidad,empresa,placa,capacidad) 
VALUES						 (1,'Trasportes Cristina','GBA-1985',15),
							 (2,'Trasportes Villeda Morales','ADA-0204',24),
							 (3,'Trasportes del Norte','RBA-9824',10),
							 (4,'Headman Alas','QBA-1435',24),
							 (5,'Logistica Nacional HN','GRD-1846',10),
							 (6,'Trasportes Central Hondureño','KHT-1655',15),
							 (7,'Trasportes Mirna','RTB-9550',24),
							 (8,'Trasportes Congolon','MBG-1025',30),
							 (9,'Trasportes Cristina','HTN-9654',10),
							 (9,'Trasportes Villeda Morales','MVD-8522',15),
							 (10,'Trasportes del Norte','RTB-1220',30);

CREATE TABLE Unidad_Ruta(
	id_unidad INT NOT NULL,
    id_ruta  INT NOT NULL,
    
    PRIMARY KEY(id_unidad, id_ruta),
    
    FOREIGN KEY(id_unidad)
    REFERENCES Unidad_Transporte(id_unidad),
		
	FOREIGN KEY(id_ruta)
    REFERENCES Ruta(id_ruta)
);

INSERT INTO Unidad_Ruta(id_unidad,id_ruta) 
VALUES				   (10,1),
					   (9 ,2),
					   (8 ,3),
					   (7 ,4),
					   (6 ,5),
					   (1 ,10),
					   (2 ,9),
					   (3 ,6),
					   (4 ,8),
					   (5 ,7);

CREATE TABLE Operador_Unidad (
	id_operador INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    
    disponible BOOLEAN NOT NULL,
    turno VARCHAR(100) NOT NULL,
    
    id_admin INT NOT NULL, 
    FOREIGN KEY(id_admin) 
    REFERENCES Administrador(id_admin),
    
    id_unidad INT NOT NULL,
    FOREIGN KEY(id_unidad)
    REFERENCES Unidad_Transporte(id_unidad),
    
	id_rol_usuario INT NOT NULL,
    FOREIGN KEY (id_rol_usuario)
    REFERENCES Rol_Usuario(id_rol_usuario),
    
    id_persona INT NOT NULL,
	FOREIGN KEY(id_persona)
	REFERENCES Persona(id_persona)
);

-- CREAR UAN TABLE DE TIPO DE TURNO PARA CREAR UN TIPO DIURNO, MIXTO, NOCTURNO--
INSERT INTO Operador_Unidad(id_operador,disponible,turno,id_admin,id_unidad,id_rol_usuario,id_persona) 
VALUES					   (1,TRUE,'DIURNO'  ,1,10,2,7),
						   (2,TRUE,'MIXO'    ,2,9,2,8),
						   (3,TRUE,'NOCTURNO',3,1,2,9),
						   (4,TRUE,'DIURNO'  ,2,2,2,10),
						   (5,TRUE,'DIURNO'  ,3,3,2,8),
						   (6,TRUE,'DIURNO'  ,1,4,2,9),
						   (7,TRUE,'DIURNO'  ,2,5,2,10),
						   (8,TRUE,'DIURNO'  ,3,8,2,7),
						   (9,TRUE,'DIURNO'  ,2,7,2,10),
						   (10,TRUE,'DIURNO' ,1,6,2,8);

CREATE TABLE Jornada (
	id_jornada INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    
    id_horario INT NOT NULL, 
    FOREIGN KEY(id_horario) 
    REFERENCES Horario(id_horario),
    
    id_unidad INT NOT NULL, 
    FOREIGN KEY(id_unidad) 
    REFERENCES Unidad_Transporte(id_unidad)
);

-- fijarme si los horarios de entrada son iguales a los horario diurno mixto, nocturno que ingrese antes --
INSERT INTO Jornada(id_jornada,hora_entrada,hora_salida,id_horario,id_unidad) 
VALUES			   (1,'08:00:00','18-00-00',10,1),
				   (2,'09:00:00','17-00-00',9,2),
				   (3,'13:30:00','21-30-00',8,3),
				   (4,'07:00:00','17-00-00',7,4),
				   (5,'10:15:00','20-15-00',6,6),
				   (6,'08:45:00','17-45-00',4,5),
				   (7,'06:30:00','18-30-00',5,7),
				   (8,'10:45:00','21-45-00',1,8),
				   (9,'9:15:00','19-15-00',2,10),
				   (10,'8:30:00','16-30-00',3,9);

CREATE TABLE Plan_Saldo (
	id_plan_saldo INT PRIMARY KEY AUTO_INCREMENT NOT NULL,    
    nombre_plan VARCHAR(100) NOT NULL,
    duracion_dias INT NOT NULL,
    precio_plan DECIMAL(10,2) NOT NULL,
    fecha_creacion DATETIME
);

INSERT INTO Plan_Saldo(id_plan_saldo,nombre_plan,duracion_dias,precio_plan,fecha_creacion) 
VALUES				  (1,'Plan Individual' ,1,25,'2026-10-31 08:30:00'),
					  (2,'Plan Familiar'   ,7,175,'2026-10-31  08:30:00'),
                      (3,'Plan Individual' ,1,25,'2026-10-31 08:30:00'),
                      (4,'Plan Expresso'   ,3,75,'2026-10-31 08:30:00'),
                      (5,'Plan Local'      ,2,50,'2026-10-31 08:30:00'),
                      (6,'Plan Turistico'  ,5,125,'2026-10-31 08:30:00'),
                      (7,'Plan Familiar'   ,7,175,'2026-10-31 08:30:00'),
                      (8,'Plan Expresso'   ,3,75,'2026-10-31 08:30:00'),
                      (9,'Plan Local'      ,2,50,'2026-10-31 08:30:00'),
                      (10,'Plan Turistico' ,5,125,'2026-10-31 08:30:00');

CREATE TABLE Saldo_Actual(
	id_saldo INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    saldo_disponible INT NOT NULL,
	estado_plan VARCHAR(10) NOT NULL,

	id_plan_saldo INT NOT NULL,
    FOREIGN KEY(id_plan_saldo)
    REFERENCES Plan_Saldo(id_plan_saldo),
    
    id_usuario INT NOT NULL,
    FOREIGN KEY(id_usuario)
    REFERENCES Usuario(id_usuario)
);

-- Crear una tabla de estado para estado_plan para historial debido a que en tabla solo funcionaria en estado activo no otra forma
INSERT INTO Saldo_Actual(id_saldo,saldo_disponible,estado_plan,id_plan_saldo,id_usuario) 
VALUES					(1,25,'ACTIVO',10,1);

CREATE TABLE Historial(
	id_historial INT PRIMARY KEY AUTO_INCREMENT NOT NULL,

    fecha_transaccion DATETIME NOT NULL,
	metodo_pago VARCHAR(100) NOT NULL,
    numero_referencia VARCHAR(100) NOT NULL UNIQUE,
    estado_plan VARCHAR(10) NOT NULL,
    
    id_plan_saldo INT NOT NULL, 
    FOREIGN KEY(id_plan_saldo) 
    REFERENCES Plan_Saldo(id_plan_saldo),
    
    id_usuario INT NOT NULL,
    FOREIGN KEY(id_usuario)
    REFERENCES Usuario(id_usuario)
);

--- AGREGAR TABLA DE METODO DE PAGO COMO DEBITO, CREDITO, Y TABLA DE ESTADO_PLAN QUE MENCIONE PREVIAMENTE
INSERT INTO Historial(id_historial,fecha_transaccion,metodo_pago,numero_referencia,estado_plan,id_plan_saldo,id_usuario) 
VALUES				 (1,'2026-11-22 08:30:00','DEBITO','RAS-A5B2X9','USADO',1,5);

CREATE TABLE Codigo_QR(
	id_codigo_qr INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    estado_qr BOOLEAN NOT NULL,
    duracion_qr INT NOT NULL,
    token_qr VARCHAR(255) UNIQUE NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    fecha_expiracion DATETIME NOT NULL,
    fecha_uso TIME NULL,
    
	id_usuario INT NOT NULL,
    FOREIGN KEY(id_usuario)
    REFERENCES Usuario(id_usuario),
    
    id_historial INT NOT NULL,
    FOREIGN KEY(id_historial)
    REFERENCES Historial(id_historial)
);

INSERT INTO Codigo_QR(id_codigo_qr,estado_qr,duracion_qr,token_qr,fecha_creacion,fecha_expiracion,fecha_uso,id_usuario,id_historial) 
VALUES        		 (1,FALSE,5,'','2026-11-22 21:00:00','2026-11-22 21:05:00','2026-11-22',5,1);