# E-Commerce API

## Overview
This is a RESTful API for a simple e-commerce platform where **buyers** can view and purchase products listed by **sellers**. Sellers can manage their product catalog and view orders received from buyers.

## Features

### Authentication
- JWT-based user authentication.
- Role-based access for `buyer` and `seller`.

### Buyer Capabilities
- View list of all sellers.
- View a seller’s product catalog.
- Place an order with products from a seller’s catalog.

### Seller Capabilities
- Create and manage a product catalog (one catalog per seller).
- View all orders placed for their products.

## Tech Stack

- **Node.js** – JavaScript runtime.
- **Express.js** – Web framework.
- **PostgreSQL** – Relational database.
- **pg** – PostgreSQL client for Node.js (`pool` used for connection).
- **JWT** – Authentication with JSON Web Tokens.
- **bcryptjs** – Secure password hashing.

## Folder Structure

Create a '.env ' file in root directory and add the following:
PORT=4000
DB_HOST=localhost
DB_USER=prameela
DB_PASSWORD=12345
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=secret123
