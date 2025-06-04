const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== OpenAI API Key Setup ===');
console.log('This script will help you set up your OpenAI API key for the AgroTech Nexus application.');
console.log('You can get an API key from https://platform.openai.com/api-keys');
console.log('');

rl.question('Enter your OpenAI API key (or press Enter to skip): ', (apiKey) => {
  const envPath = path.join(__dirname, 'backend', '.env');
  
  try {
    // Read the current .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    if (apiKey.trim()) {
      // Replace the OpenAI API key line
      if (envContent.includes('OPENAI_API_KEY=')) {
        envContent = envContent.replace(/OPENAI_API_KEY=.*/, `OPENAI_API_KEY=${apiKey.trim()}`);
      } else {
        // Add the key if it doesn't exist
        envContent += `\nOPENAI_API_KEY=${apiKey.trim()}`;
      }
      
      // Write the updated content back to the .env file
      fs.writeFileSync(envPath, envContent);
      
      console.log('\n✅ OpenAI API key has been set successfully!');
      console.log('The AI features of the application will now work properly.');
    } else {
      console.log('\n⚠️ No API key provided. The application will use mock AI responses.');
      console.log('You can set the API key later by editing the backend/.env file.');
    }
  } catch (error) {
    console.error('\n❌ Error updating .env file:', error.message);
    console.log('Please manually add your OpenAI API key to the backend/.env file.');
  }
  
  rl.close();
});