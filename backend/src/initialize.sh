#!/bin/bash

# Get command-line arguments
DB_NAME=$1
DB_USER=$2
DB_PASSWORD=$3
# Create database if not exists
echo "SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec" | psql -d postgres

# Connect to the database
psql -U $DB_USER -d $DB_NAME -c "
  -- Create tables

    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      roles TEXT[]
    );

  CREATE TABLE IF NOT EXISTS "Events" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    cover VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    ticketCount INTEGER NOT NULL,
    purchasedCount INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS "Tickets" (
    id SERIAL PRIMARY KEY,
    purchaseDate DATE NOT NULL,
    userId INTEGER NOT NULL,
    eventId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users (id),
    FOREIGN KEY (eventId) REFERENCES Events (id)
  );

  -- Create dummy data
  INSERT INTO Users (username, password, roles)
  VALUES ('admin', 'admin', ARRAY['user', 'admin']);

  INSERT INTO Events (name, date, cover, description, location, price, ticketCount)
  VALUES ('Event 1', '2024-03-01', 'cover1.jpg', 'This is event 1', 'Location 1', 10.99, 100);

  INSERT INTO Events (name, date, cover, description, location, price, ticketCount)
  VALUES ('Event 2', '2024-03-15', 'cover2.jpg', 'This is event 2', 'Location 2', 20.99, 200);
  
  INSERT INTO Events (name, date, cover, description, location, price, ticketCount, purchasedCount)
  VALUES ('Event 3', '2024-03-15', 'cover3.jpg', 'This is event 2', 'Location 3', 21.99, 200, 200);
  
  INSERT INTO Events (name, date, cover, description, location, price, ticketCount, purchasedCount)
  VALUES ('Event 4', '2024-03-15', 'cover4.jpg', 'This is event 2', 'Location 4', 3.99, 200, 200);
  
  INSERT INTO Events (name, date, cover, description, location, price, ticketCount)
  VALUES ('Event 5', '2024-03-15', 'cover5.jpg', 'This is event 2', 'Location 5', 10.99, 200);

  INSERT INTO Tickets (purchaseDate, userId, eventId)
  VALUES ('2024-02-20', 1, 1);

  INSERT INTO Tickets (purchaseDate, userId, eventId)
  VALUES ('2024-02-25', 1, 2);
"

echo "Database and tables created successfully!"
echo "Dummy data inserted successfully!"