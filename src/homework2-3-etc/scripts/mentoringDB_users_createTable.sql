CREATE TABLE users
    (id SERIAL PRIMARY KEY,
    login VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    age INT NOT NULL,
    "isDeleted" BOOLEAN,
    "createdAt" DATE,
    "updatedAt" DATE);
