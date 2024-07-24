CREATE DATABASE if not exists itms_database;

USE itms_database;

CREATE TABLE if not exists role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE if not exists users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    pesel VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL
);

CREATE TABLE if not exists user_role (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE if not exists type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL
);

CREATE TABLE if not exists task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    state INT NOT NULL,
    priority INT NOT NULL,
    type_id INT NOT NULL,
    creation_date DATETIME NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    is_active BOOLEAN NOT NULL,
    FOREIGN KEY (type_id) REFERENCES type(id)
);

CREATE TABLE if not exists user_task (
    user_id INT NOT NULL,
    task_id INT NOT NULL,
    PRIMARY KEY (user_id, task_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (task_id) REFERENCES task(id)
);

CREATE TABLE if not exists product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    height INT NOT NULL,
    width INT NOT NULL,
    length INT NOT NULL,
    weight INT NOT NULL,
    is_active BOOLEAN NOT NULL
);

CREATE TABLE if not exists warehouse (
    id INT AUTO_INCREMENT PRIMARY KEY,
    building VARCHAR(255) NOT NULL,
    zone VARCHAR(255) NOT NULL,
    space_id INT NOT NULL,
    space_height INT NOT NULL,
    space_width INT NOT NULL,
    space_length INT NOT NULL,
    product_id INT,
    is_active BOOLEAN NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE if not exists task_product (
    task_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (task_id, product_id),
    FOREIGN KEY (task_id) REFERENCES task(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE if not exists task_warehouse (
    task_id INT NOT NULL,
    warehouse_id INT NOT NULL,
    PRIMARY KEY (task_id, warehouse_id),
    FOREIGN KEY (task_id) REFERENCES task(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
);