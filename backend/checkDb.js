const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Check if we're using mock database
if (process.env.DB_USE_MOCK === 'true') {
  console.log("✅ Using mock database (no MySQL required)");
  console.log("The following test accounts are available:");
  console.log("- Email: admin@example.com, Password: password123, Role: Admin");
  console.log("- Email: seller@example.com, Password: password123, Role: Seller");
  console.log("- Email: buyer@example.com, Password: password123, Role: Buyer");
  process.exit(0);
}

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  // Don't specify database yet, as we might need to create it
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
    console.log("\nPossible solutions:");
    console.log("1. Make sure MySQL server is running");
    console.log("2. Check your MySQL credentials in the .env file");
    console.log("3. Run 'node setup-db.js' to configure the database");
    console.log("4. Or set DB_USE_MOCK=true in .env to use the mock database");
    process.exit(1);
  } else {
    console.log("✅ Connected to MySQL server successfully");
    
    // Check if database exists
    db.query(`SHOW DATABASES LIKE '${process.env.DB_NAME || 'agritech'}'`, (err, results) => {
      if (err) {
        console.error("Error checking database:", err);
        process.exit(1);
      }
      
      if (results.length === 0) {
        console.log(`❌ Database '${process.env.DB_NAME || 'agritech'}' does not exist. Creating it now...`);
        
        // Create database
        db.query(`CREATE DATABASE ${process.env.DB_NAME || 'agritech'}`, (err) => {
          if (err) {
            console.error("Error creating database:", err);
            process.exit(1);
          }
          
          console.log(`✅ Database '${process.env.DB_NAME || 'agritech'}' created successfully`);
          
          // Connect to the new database
          db.changeUser({ database: process.env.DB_NAME || 'agritech' }, (err) => {
            if (err) {
              console.error("Error connecting to new database:", err);
              process.exit(1);
            }
            
            createTables(db);
          });
        });
      } else {
        console.log(`✅ Database '${process.env.DB_NAME || 'agritech'}' exists`);
        
        // Connect to the database
        db.changeUser({ database: process.env.DB_NAME || 'agritech' }, (err) => {
          if (err) {
            console.error("Error connecting to database:", err);
            process.exit(1);
          }
          
          checkTables(db);
        });
      }
    });
  }
});

function checkTables(db) {
  // Check if users table exists
  db.query("SHOW TABLES LIKE 'users'", (err, results) => {
    if (err) {
      console.error("Error checking tables:", err);
      process.exit(1);
    }
    
    if (results.length === 0) {
      console.log("❌ 'users' table does not exist. Creating tables now...");
      createTables(db);
    } else {
      console.log("✅ 'users' table exists");
      
      // Check if there are any users
      db.query("SELECT COUNT(*) as count FROM users", (err, results) => {
        if (err) {
          console.error("Error counting users:", err);
          process.exit(1);
        }
        
        console.log(`✅ Found ${results[0].count} users in the database`);
        process.exit(0);
      });
    }
  });
}

function createTables(db) {
  // Create users table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      phone VARCHAR(20),
      location TEXT,
      upi VARCHAR(100),
      gpay VARCHAR(100),
      phonepe VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableSQL, (err) => {
    if (err) {
      console.error("Error creating users table:", err);
      process.exit(1);
    }
    
    console.log("✅ 'users' table created successfully");
    
    // Create other necessary tables
    // ... (add more table creation queries as needed)
    
    console.log("✅ Database setup completed successfully");
    process.exit(0);
  });
}