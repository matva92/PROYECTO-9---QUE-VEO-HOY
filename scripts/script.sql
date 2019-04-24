CREATE DATABASE QUEVEOHOY;

USE QUEVEOHOY;

CREATE TABLE genero (
    id INT NOT NULL AUTO_INCREMENT,
    NOMBRE VARCHAR (30),
    PRIMARY KEY(id)
);

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
	genero_id INT,
	PRIMARY KEY (id),
	FOREIGN KEY (genero_id) REFERENCES genero(id)
);



CREATE TABLE actor (
    id INT NOT NULL AUTO_INCREMENT,
    NOMBRE VARCHAR (70),
    PRIMARY KEY(id)
);

CREATE TABLE actor_pelicula (
    id INT NOT NULL AUTO_INCREMENT,
    actor_id INT,
	pelicula_id INT,
	FOREIGN KEY (actor_id) REFERENCES actor(id),
	FOREIGN KEY (pelicula_id) REFERENCES pelicula(id),
	PRIMARY KEY(id)
);

-- ALTER TABLE pelicula ADD COLUMN genero_id INT; 
-- ALTER TABLE pelicula ADD FOREIGN KEY (genero_id) REFERENCES genero(id);
   