# E-Commerce API

## Overview
This is a RESTful API for a simple e-commerce platform where buyers can view and purchase products listed by sellers. Sellers can manage their product catalog and view received orders.

## Features
- **User Authentication**: JWT-based login and registration for buyers and sellers.
- **Seller Features**:
  - Create and manage product catalog (one catalog per seller).
  - View orders with buyer details and product information.
- **Buyer Features**:
  - View a list of all sellers.
  - View the catalog of a specific seller.
  - Create orders for products from a seller's catalog.

## Technologies Used
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for handling API requests.
- **PostgreSQL**: Relational database for storing user, product, catalog, and order data.
- **Sequelize ORM**: For managing database models and queries.
- **JWT (JSON Web Token)**: Authentication and authorization.
- **Bcryptjs**: For password hashing.

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd ecommerce-api
