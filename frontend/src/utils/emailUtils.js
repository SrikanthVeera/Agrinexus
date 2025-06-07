import { send } from "@emailjs/browser";

/**
 * Send an order confirmation email using EmailJS.
 * @param {Object} params - { user_name, user_email, order_id, address }
 * @returns {Promise<void>}
 */
export async function sendOrderConfirmationEmail({ user_name, user_email, order_id, address }) {
  try {
    const SERVICE_ID = "service_yay9pzs";
    const TEMPLATE_ID = "template_xxxxxx"; // <-- Replace with your actual template ID
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY_HERE"; // <-- Replace with your actual public key

    const templateParams = {
      user_name,
      user_email,
      order_id,
      address,
    };

    const result = await send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log("Order confirmation email sent:", result.status, result.text);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}
