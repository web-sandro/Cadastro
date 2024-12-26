DROP DATABASE IF EXISTS `tasklistdb`;
CREATE DATABASE `tasklistdb`;
USE `tasklistdb`;

CREATE TABLE user (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(255),
    photo VARCHAR(255),
    birthDate DATE,
    password VARCHAR(255),
    passwordResetToken VARCHAR(255),
    passwordResetExpires DATETIME,
    email VARCHAR(255),
    sex ENUM('Masculino', 'Feminino', 'Outro', 'Prefiro não responder'),
    status ENUM('Ativado', 'Desativado', 'Bloqueado') ,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME
) ENGINE=InnoDB;

CREATE TABLE message (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    content TEXT NULL,
    createdAt DATETIME NOT NULL DEFAULT NOW(),
    user_id INT UNSIGNED NULL,
    filename VARCHAR(255) NULL,
    path VARCHAR(255) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_message_user FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE SET NULL -- CASCADE
) ENGINE=InnoDB;

CREATE TABLE  chat (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    createdAt DATETIME NOT NULL DEFAULT NOW(),
    name VARCHAR(45) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;


CREATE TABLE login_status (
    user_id INT UNSIGNED PRIMARY KEY,
    logged_in BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);