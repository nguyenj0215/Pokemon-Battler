DROP DATABASE IF EXISTS game_db;

CREATE DATABASE game_db;

USE game_db;

CREATE TABLE user(
id int NOT NULL AUTO_INCREMENT,
userName VARCHAR(25) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE characterr(
id int NOT NULL AUTO_INCREMENT,
characterName VARCHAR(25) NOT NULL,
class VARCHAR(25),
hp int,
attack int,
PRIMARY KEY (id)
);
