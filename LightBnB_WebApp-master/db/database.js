// Import the 'pg' library
const { Pool } = require("pg");

// Create a new connection pool with the database
const pool = new Pool({
  user: "labber",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

// Get a user with a given email
const getUserWithEmail = function (email) {
  // Define the SQL query
  const queryString = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;
  const queryParams = [email];

  // Execute the query and return the first row in the result
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Get a user with a given id
const getUserWithId = function (id) {
  // Define the SQL query
  const queryString = `
    SELECT *
    FROM users
    WHERE id = $1;
  `;
  const queryParams = [id];

  // Execute the query and return the first row in the result
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Add a new user to the database
const addUser = function (user) {
  // Define the SQL
  const queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const queryParams = [user.name, user.email, user.password];

  // Execute the query and return the inserted row
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Get all reservations for a given guest_id, with a default limit of 10
const getAllReservations = function (guest_id, limit = 10) {
  // Define the SQL query
  const queryString = `
    SELECT reservations.*, properties.*, users.name AS owner_name
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN users ON properties.owner_id = users.id
    WHERE reservations.guest_id = $1
    AND end_date < NOW()::date
    ORDER BY start_date
    LIMIT $2;
  `;
  const queryParams = [guest_id, limit];

  // Execute the query and return the result rows
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Get all properties based on provided options, with a limit of 10
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
  `;
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    if (queryParams.length === 1) {
      queryString += `WHERE city LIKE $${queryParams.length} `;
    } else {
      queryString += `AND city LIKE $${queryParams.length} `;
    }
  }
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    if (queryParams.length === 1) {
      queryString += `WHERE cost_per_night >= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    }
  }
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    if (queryParams.length === 1) {
      queryString += `WHERE cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night <= $${queryParams.length} `;
    }
  }
  queryString += `
    GROUP BY properties.id
    `;
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
      HAVING AVG(property_reviews.rating) >= $${queryParams.length}
    `;
  }
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// Define the SQL
const addProperty = function (property) {
  const queryString = `
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
  ];

  // Execute the query and return the inserted row
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
