// src/components/Footer.js

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white mt-12 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
      <div>
        <h4 className="font-semibold mb-2">AgriConnect</h4>
        <p>
          Enhancing agricultural supply chains through digital platforms for
          real-time market integration and fair pricing.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Quick Links</h4>
        <ul>
          <li>Home</li>
          <li>About Us</li>
          <li>Products</li>
          <li>Farmers</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Services</h4>
        <ul>
          <li>Market Integration</li>
          <li>Fair Price Discovery</li>
          <li>Bulk Orders</li>
          <li>Order Tracking</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Contact Us</h4>
        <p>📍 123 Agriculture Street, Chennai, TN - 600001</p>
        <p>📞 +91 98765 43210</p>
        <p>📧 info@agriconnect.com</p>
      </div>
    </footer>
  );
};

export default Footer;
