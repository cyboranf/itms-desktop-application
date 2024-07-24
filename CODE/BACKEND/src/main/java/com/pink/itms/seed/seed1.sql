-- Utwórz bazę danych, jeśli nie istnieje
CREATE DATABASE IF NOT EXISTS itms_database;
USE itms_database;

-- Stwórz tabelę ról z kolumną is_active
CREATE TABLE IF NOT EXISTS role (
  id bigint(20) NOT NULL PRIMARY KEY,
  name varchar(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Stwórz tabelę użytkowników z kolumną is_active
CREATE TABLE IF NOT EXISTS users (
  id bigint(20) NOT NULL PRIMARY KEY,
  user_name text NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  last_name text NOT NULL,
  pesel text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Stwórz tabelę przypisania ról do użytkowników
CREATE TABLE IF NOT EXISTS user_role (
  user_id bigint(20) NOT NULL,
  role_id bigint(20) NOT NULL
);

-- Tabela z typami zadań z kolumną is_active
CREATE TABLE IF NOT EXISTS type (
  id bigint NOT NULL PRIMARY KEY,
  name varchar(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Tabela zadaniami z kolumną is_active
CREATE TABLE IF NOT EXISTS task (
  id bigint(20) NOT NULL PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  state int(11) NOT NULL,
  priority int(11) NOT NULL,
  type_id tinyint(4) NOT NULL,
  creation_date datetime NOT NULL,
  start_date datetime NULL,
  end_date datetime NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Tabela relacji użytkownicy-zadania
CREATE TABLE IF NOT EXISTS user_task (
  task_id bigint NOT NULL,
  user_id bigint NOT NULL
);

-- Tabela produktów z kolumną is_active
CREATE TABLE IF NOT EXISTS product (
  id bigint(20) NOT NULL PRIMARY KEY,
  name varchar(255) NOT NULL,
  code varchar(255) NOT NULL,
  width double NOT NULL,
  height double NOT NULL,
  length double NOT NULL,
  weight double NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Tabela magazynów z kolumną is_active
CREATE TABLE IF NOT EXISTS warehouse (
  id bigint(20) NOT NULL PRIMARY KEY,
  building varchar(255) NOT NULL,
  zone varchar(255) NOT NULL,
  space_id bigint NOT NULL,
  space_height double DEFAULT NULL,
  space_width double DEFAULT NULL,
  space_length double DEFAULT NULL,
  product_id bigint,
  is_active BOOLEAN DEFAULT TRUE
);

-- Tabela relacji zadania-produkty
CREATE TABLE IF NOT EXISTS task_product (
  task_id bigint(20) NOT NULL,
  product_id bigint(20) NOT NULL
);

-- Tabela relacji zadania-magazyny
CREATE TABLE IF NOT EXISTS task_warehouse (
  warehouse_id bigint(20) NOT NULL,
  task_id bigint(20) NOT NULL
);

-- Reset autoincrementów (opcjonalnie)
ALTER TABLE role AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE type AUTO_INCREMENT = 1;
ALTER TABLE task AUTO_INCREMENT = 1;
ALTER TABLE product AUTO_INCREMENT = 1;
ALTER TABLE warehouse AUTO_INCREMENT = 1;

-- Wstawienie danych
INSERT INTO role (id, name) VALUES
(1, 'Admin'),
(2, 'Manager'),
(3, 'Warehouseman'),
(4, 'Printer');

INSERT INTO users (id, user_name, password, name, last_name, pesel, email, phone_number, is_active) VALUES
(1, 'JKowalski', 'hashed_password', 'Jan', 'Kowalski', 'encrypted_pesel', 'jKowalski@gmail.com', '123123123', TRUE),
(2, 'ARogalska', 'hashed_password', 'Anna', 'Rogalska', 'encrypted_pesel', 'aRogalska@gmail.com', '234234234', TRUE),
(3, 'RKaczmarski', 'hashed_password', 'Robert', 'Kaczmarski', 'encrypted_pesel', 'rKaczmarksi@gmail.com', '345345345', TRUE),
(4, 'SStołeczny', 'hashed_password', 'Stanisław', 'Stołeczny', 'encrypted_pesel', 'sStoleczny@gmail.com', '456456456', TRUE);

INSERT INTO user_role (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

INSERT INTO type (id, name) VALUES
(1, 'Import'),
(2, 'Shipment'),
(3, 'Move'),
(4, 'Print'),
(5, 'Order product'),
(6, 'Administrative changes'),
(7, 'Others');

INSERT INTO task (id, name, description, state, priority, type_id, creation_date, start_date, end_date, is_active) VALUES
(1, 'Prepare products for shipment', 'Description', 0, 5, 2, '2024-01-14 10:10:00', '2024-01-10 09:10:00', '2024-01-10 09:10:00', TRUE),
(2, 'Move products', 'Description', 0, 4, 3, '2024-01-10 10:09:00', '2024-01-10 09:10:00', '2024-01-10 09:10:00', TRUE),
(3, 'Prepare products for shipment', 'Description', 1, 6, 2, '2024-01-09 10:12:00', '2024-01-10 09:10:00', '2024-01-10 09:10:00', TRUE),
(4, 'Unload transport', 'Description', 2, 10, 1, '2024-01-01 08:00:00', '2024-01-01 08:01:00', '2024-01-01 09:01:00', TRUE);

INSERT INTO user_task (task_id, user_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

INSERT INTO product (id, name, code, height, width, length, weight, is_active) VALUES
(1, 'Product1', 'Code1', 50, 90, 70, 11, TRUE),
(2, 'Product2', 'Code2', 70, 70, 50, 8, TRUE);

INSERT INTO warehouse (id, building, zone, space_id, space_height, space_width, space_length, product_id, is_active) VALUES
(1, 'Building1', 'Zone1', 1, 110, 120, 120, 1, TRUE),
(2, 'Building2', 'Zone2', 2, 130, 130, 110, 2, TRUE);

INSERT INTO task_product (task_id, product_id) VALUES
(1, 1),
(2, 2);

INSERT INTO task_warehouse (task_id, warehouse_id) VALUES
(1, 1),
(2, 2);
