# AgroTech Nexus

A platform connecting farmers, buyers, and delivery partners for agricultural products.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- OpenAI API Key (optional, for AI features)

### Database Setup

You have two options for the database:

#### Option 1: Use the Mock Database (No MySQL Required)

1. Set `DB_USE_MOCK=true` in the backend/.env file (this is the default)
2. The application will use an in-memory mock database with test accounts:
   - Email: `admin@example.com`, Password: `password123`, Role: Admin
   - Email: `seller@example.com`, Password: `password123`, Role: Seller
   - Email: `buyer@example.com`, Password: `password123`, Role: Buyer

#### Option 2: Use a Real MySQL Database

1. Install and start MySQL
2. Create a database named `agritech`
3. Set `DB_USE_MOCK=false` in the backend/.env file
4. Update the database credentials in the .env file if needed
5. Run the database check script to create necessary tables:
   ```
   cd backend
   node checkDb.js
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - The `.env` file should already be set up with default values
   - Update the database credentials if needed

4. Start the backend server:
   ```
   npm start
   ```
   The server will run on http://localhost:5001

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```
   The application will open in your browser at http://localhost:3000

### Quick Start

You can use the provided batch file to manage the application:
```
start.bat
```

This will show a menu with options to:
1. Start the application (both backend and frontend)
2. Set up your OpenAI API key
3. Check the database
4. Exit

### OpenAI API Key Setup

The application includes AI features that require an OpenAI API key. You have two options:

1. **Using the setup script**:
   - Run `node setup-openai.js` or select option 2 from the start.bat menu
   - Enter your OpenAI API key when prompted

2. **Manual setup**:
   - Edit the `.env` file in the backend directory
   - Set the `OPENAI_API_KEY` value to your API key

If you don't have an API key, the application will use mock responses for AI features.

## User Roles

The application supports the following user roles:

- **Buyer**: Can browse products, place orders, and track deliveries
- **Seller**: Can list products, manage inventory, and fulfill orders
- **Delivery Partner**: Can accept delivery assignments and update delivery status
- **Entrepreneur**: Can access business tools and analytics

## Login Information

Each user type has its own login page:

- Buyer: `/login/buyer`
- Seller: `/login/seller`
- Delivery Partner: `/delivery/login`
- Entrepreneur: `/login/entrepreneur`

When registering, users will be automatically redirected to the appropriate login page based on their role.

## Troubleshooting

### Login Issues (400 Bad Request)

If you encounter a 400 Bad Request error when logging in:

1. Make sure the MySQL server is running
2. Check that the database and tables are properly set up
3. Verify that the user credentials are correct
4. Check the server logs for more detailed error messages

### OpenAI API Key Error

If you see an error about the OpenAI API key:

1. The application will still work, but AI features will use mock responses
2. To enable real AI responses:
   - Get an API key from https://platform.openai.com/api-keys
   - Set up the key using the instructions in the "OpenAI API Key Setup" section
   - Restart the backend server

### Database Connection Issues

If the server fails to connect to the database:

1. Make sure MySQL is running
2. Check the database credentials in the `.env` file
3. Run the database check script: `node backend/checkDb.js`