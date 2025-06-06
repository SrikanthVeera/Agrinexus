// db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Flag to track if we're using mock data
let usingMockDb = false;

// In-memory storage for mock database
const mockStorage = {
  products: [],
  productId: 1,
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '9876543210',
      password: '$2a$10$N.1pRWBRxHXCOY4YRGGkm.a.JwjT.Rkm5UQwNQB3fHKZCnGLz.YwK', // hash for 'password123'
      role: 'admin'
    },
    {
      id: 4,
      name: 'Srikanth Admin',
      email: 'srikanthveera0912@gmail.com',
      phone: '9876543211',
      password: '$2a$10$N.1pRWBRxHXCOY4YRGGkm.a.JwjT.Rkm5UQwNQB3fHKZCnGLz.YwK', // This will be replaced with the correct hash
      role: 'admin'
    },
    {
      id: 2,
      name: 'Seller User',
      email: 'seller@example.com',
      phone: '9876543212',
      password: '$2a$10$N.1pRWBRxHXCOY4YRGGkm.a.JwjT.Rkm5UQwNQB3fHKZCnGLz.YwK',
      role: 'Seller'
    },
    {
      id: 3,
      name: 'Buyer User',
      email: 'buyer@example.com',
      phone: '9876543213',
      password: '$2a$10$N.1pRWBRxHXCOY4YRGGkm.a.JwjT.Rkm5UQwNQB3fHKZCnGLz.YwK',
      role: 'Buyer'
    }
  ],
  nextId: 5
};

// Create a mock DB object for development without a database
const mockDb = {
  query: (sql, params, callback) => {
    console.log("MOCK DB QUERY:", sql);
    
    // If callback is the second parameter (no params provided)
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    
    // Mock responses for different query types
    if (sql.toLowerCase().includes('select * from users where email = ? or phone = ?')) {
      // Mock user lookup by email or phone
      const email = params[0];
      const phone = params[1];
      const user = mockStorage.users.find(u => u.email === email || u.phone === phone);
      
      if (user) {
        callback(null, [user]);
      } else {
        callback(null, []); // User not found
      }
    } else if (sql.toLowerCase().includes('select * from users where email =')) {
      // Mock user lookup by email
      const email = params[0];
      const user = mockStorage.users.find(u => u.email === email);
      
      if (user) {
        callback(null, [user]);
      } else {
        callback(null, []); // User not found
      }
    } else if (sql.toLowerCase().includes('select * from users where phone =')) {
      // Mock user lookup by phone
      const phone = params[0];
      const user = mockStorage.users.find(u => u.phone === phone);
      
      if (user) {
        callback(null, [user]);
      } else {
        callback(null, []); // User not found
      }
    } else if (sql.toLowerCase().includes('insert into users')) {
      // Mock user registration
      const [name, email, phone, password, role] = params;
      
      // Check if user already exists
      const existingUserByEmail = mockStorage.users.find(u => u.email === email);
      const existingUserByPhone = mockStorage.users.find(u => u.phone === phone);
      
      if (existingUserByEmail) {
        const error = new Error("Email already registered");
        error.code = "ER_DUP_ENTRY";
        return callback(error);
      }
      
      if (existingUserByPhone) {
        const error = new Error("Phone number already registered");
        error.code = "ER_DUP_ENTRY";
        return callback(error);
      }
      
      // Create new user
      const newUser = {
        id: mockStorage.nextId++,
        name,
        email,
        phone,
        password,
        role
      };
      
      mockStorage.users.push(newUser);
      console.log("Mock DB: Added new user:", email);
      
      callback(null, { insertId: newUser.id });
    } else if (sql.toLowerCase().includes('select count(*) as count from users')) {
      // Mock user count
      callback(null, [{ count: mockStorage.users.length }]);
    } else if (sql.toLowerCase().includes('show tables like')) {
      // Mock table check
      callback(null, [{ Tables_in_agritech: 'users' }]);
    } else if (sql.toLowerCase().includes('insert into products')) {
      // Mock product creation
      const [seller_id, name, price, location, image_url, stock] = params;
      
      // Validate seller_id
      if (!seller_id || isNaN(parseInt(seller_id))) {
        const error = new Error("Invalid seller_id. A valid numeric seller_id is required.");
        return callback(error);
      }
      
      const newProduct = {
        id: mockStorage.productId++,
        seller_id: parseInt(seller_id),
        name,
        price,
        location,
        image_url,
        stock,
        created_at: new Date().toISOString()
      };
      
      mockStorage.products.push(newProduct);
      console.log("Mock DB: Added new product:", name);
      
      callback(null, { insertId: newProduct.id });
    } else if (sql.toLowerCase().includes('select') && sql.toLowerCase().includes('from products')) {
      // Mock product retrieval
      if (sql.toLowerCase().includes('join users')) {
        // Join with users table
        const productsWithSellerInfo = mockStorage.products.map(product => {
          const seller = mockStorage.users.find(u => u.id == product.seller_id);
          return {
            ...product,
            sellerGpay: seller?.gpay || null,
            sellerUpi: seller?.upi || null,
            sellerPhonepe: seller?.phonepe || null,
            sellerPhone: seller?.phone || null
          };
        });
        callback(null, productsWithSellerInfo);
      } else {
        callback(null, mockStorage.products);
      }
    } else if (sql.toLowerCase().includes('update products')) {
      // Mock product update
      const id = params[params.length - 1]; // Last parameter is the ID
      const index = mockStorage.products.findIndex(p => p.id == id);
      
      if (index !== -1) {
        // Update product fields
        const [name, price, location, image_url, stock] = params;
        mockStorage.products[index] = {
          ...mockStorage.products[index],
          name,
          price,
          location,
          image_url,
          stock
        };
        callback(null, { affectedRows: 1 });
      } else {
        callback(null, { affectedRows: 0 });
      }
    } else if (sql.toLowerCase().includes('delete from products')) {
      // Mock product deletion
      const id = params[0];
      const initialLength = mockStorage.products.length;
      mockStorage.products = mockStorage.products.filter(p => p.id != id);
      
      callback(null, { affectedRows: initialLength - mockStorage.products.length });
    } else {
      // Default mock response
      callback(null, []);
    }
  },
  connect: (callback) => {
    console.log("✅ Using mock database for development");
    if (callback) callback(null);
  },
  end: () => {
    console.log("Mock database connection closed");
  }
};

// Try to create a real MySQL connection
let db;
try {
  // Check if we should use mock DB (either explicitly set or if DB_USE_MOCK is true)
  if (process.env.DB_USE_MOCK === 'true') {
    usingMockDb = true;
    db = mockDb;
  } else {
    // Create real MySQL connection
    db = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'TIGER',
      database: process.env.DB_NAME || 'agrotech',
      port: process.env.DB_PORT || 3306,
    });

    // Connect to MySQL
    db.connect((err) => {
      if (err) {
        console.error("❌ MySQL connection error:", err.message);
        console.warn("⚠️ Falling back to mock database for development");
        usingMockDb = true;
        db = mockDb;
      } else {
        console.log("✅ Connected to MySQL database (db.js)");
      }
    });
  }
} catch (error) {
  console.error("❌ Error setting up database connection:", error.message);
  console.warn("⚠️ Falling back to mock database for development");
  usingMockDb = true;
  db = mockDb;
}

// Add a flag to check if we're using mock DB
db.isMockDb = () => usingMockDb;

module.exports = db;