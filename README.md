# LightBnB

LightBnB is a simple web application that allows users to search for and book accommodations. The application provides functionality to register, log in, view available properties, make reservations, and manage property listings.

## Features

- User registration and authentication
- Browse and search for properties based on various filters (city, price, rating)
- View property details, including photos, descriptions, and ratings
- Make reservations for available dates
- View and manage your reservations
- Add new properties and manage existing property listings

## Getting Started

Instructions to set up and run LightBnB.

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL

### Installation

1. Clone the repository to your local machine.

    ```
    git clone https://github.com/yourusername/lightbnb.git
    ```

2. Navigate to the project directory.

    ```
    cd lightbnb
    ```

3. Install the required Node.js packages.

    ```
    npm install
    ```

4. Create a PostgreSQL database named `lightbnb` and import the provided SQL schema.

    ```
    createdb lightbnb
    psql lightbnb < db/schema.sql
    ```

5. Update the `pool` configuration in the `database.js` file with your PostgreSQL user and password.

    ```javascript
    const pool = new Pool({
      user: 'your_username',
      password: 'your_password',
      host: 'localhost',
      database: 'lightbnb'
    });
    ```

6. Start the web application.

    ```
    npm start
    ```

7. Navigate to `http://localhost:3000` to access the web app.
