CREATE DATABASE QUEVEOHOY;

USE QUEVEOHOY;

CREATE TABLE pelicula (
	id INT NOT NULL AUTO_INCREMENT,
	titulo VARCHAR (100),
	duracion INT,
	director VARCHAR (400),
	anio INT,
	fecha_lanzamiento DATE,
	puntuacion INT,
	poster VARCHAR (300),
	trama VARCHAR (700),
	PRIMARY KEY (id)
);


CREATE TABLE genero (
    id INT NOT NULL AUTO_INCREMENT,
    NOMBRE VARCHAR (30),
    PRIMARY KEY(id)
);

ALTER TABLE pelicula ADD COLUMN genero_id INT; 

ALTER TABLE pelicula ADD FOREIGN KEY (genero_id) REFERENCES genero(id);
   