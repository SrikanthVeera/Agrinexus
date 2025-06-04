const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Database Setup ===');
console.log('This script will help you configure the database settings for the AgroTech Nexus application.');
console.log('');

console.log('You have two options:');
console.log('1. Use a mock database (no MySQL required, good for testing)');
console.log('2. Use a real MySQL database (requires MySQL server)');
console.log('');

rl.question('Enter your choice (1 or 2): ', (choice) => {
  const envPath = path.join(__dirname, 'backend', '.env');
  
  try {
    // Read the current .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    if (choice === '1') {
      // Configure for mock database
      envContent = envContent.replace(/DB_USE_MOCK=.*/, 'DB_USE_MOCK=true');
      
      fs.writeFileSync(envPath, envContent);
      
      console.log('\n✅ Mock database configured successfully!');
      console.log('The application will use an in-memory database with test accounts:');
      console.log('- Email: admin@example.com, Password: password123, Role: Admin');
      console.log('- Email: seller@example.com, Password: password123, Role: Seller');
      console.log('- Email: buyer@example.com, Password: password123, Role: Buyer');
    } else if (choice === '2') {
      // Configure for real MySQL database
      rl.question('\nEnter MySQL host (default: localhost): ', (host) => {
        rl.question('Enter MySQL username (default: root): ', (user) => {
          rl.question('Enter MySQL password: ', (password) => {
            rl.question('Enter MySQL database name (default: agritech): ', (dbName) => {
              rl.question('Enter MySQL port (default: 3306): ', (port) => {
                // Update the .env file with the provided values
                if (host) envContent = envContent.replace(/DB_HOST=.*/, `DB_HOST=${host}`);
                if (user) envContent = envContent.replace(/DB_USER=.*/, `DB_USER=${user}`);
                envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password || ''}`);
                if (dbName) envContent = envContent.replace(/DB_NAME=.*/, `DB_NAME=${dbName}`);
                if (port) envContent = envContent.replace(/DB_PORT=.*/, `DB_PORT=${port}`);
                
                // Set DB_USE_MOCK to false
                envContent = envContent.replace(/DB_USE_MOCK=.*/, 'DB_USE_MOCK=false');
                
                fs.writeFileSync(envPath, envContent);
                
                console.log('\n✅ MySQL database configured successfully!');
                console.log('Make sure your MySQL server is running and the database exists.');
                console.log('You can run "node backend/checkDb.js" to verify the connection and create tables.');
                
                rl.close();
              });
            });
          });
        });
        return; // Don't close rl yet
      });
      return; // Don't close rl yet
    } else {
      console.log('\n❌ Invalid choice. Please run the script again and enter 1 or 2.');
    }
  } catch (error) {
    console.error('\n❌ Error updating .env file:', error.message);
  }
  
  if (choice !== '2') {
    rl.close();
  }
});