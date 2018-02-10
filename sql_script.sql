CREATE TABLE geopointsDB;

use geopointsDB;

CREATE TABLE pointTypes (
    typeId INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) UNIQUE CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    PRIMARY KEY (typeId) 
);

CREATE TABLE points (
    pointId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    address VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    coordinates VARCHAR(30) NOT NULL,
    pointType INT NOT NULL,
    comment VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    CONSTRAINT pointTypes_typeId_fk
    FOREIGN KEY (pointType)
    REFERENCES pointTypes(typeId)
);

INSERT INTO pointTypes(name)
VALUES('Место остановки');

INSERT INTO pointTypes(name)
VALUES('Место стоянки');