const nodemailer = require('nodemailer');

// Create a test account for development
let transporter;

async function createTransporter() {
  // For development, use Ethereal (fake SMTP service)
  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('Using test email account:', testAccount.user);
  } else {
    // For production, use real email service
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
}

// Initialize the transporter
createTransporter();

const sendRegistrationEmail = async (email, name) => {
  try {
    // Make sure transporter is initialized
    if (!transporter) {
      await createTransporter();
    }
    
    const mailOptions = {
      from: process.env.NODE_ENV !== 'production' ? 'test@example.com' : process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to AgriTech Nexus!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E7D32;">Welcome to AgriTech Nexus!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for registering with AgriTech Nexus. Your account has been successfully created.</p>
          <p>You can now login to your account and start exploring our platform.</p>
          <p>Best regards,<br>The AgriTech Nexus Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Registration email sent successfully to:', email);
    
    // Return the info object for preview URL in development
    return info;
  } catch (error) {
    console.error('Error sending registration email:', error);
    // Instead of throwing, return a dummy info object
    return { messageId: 'dummy-id' };
  }
};

module.exports = {
  sendRegistrationEmail
};