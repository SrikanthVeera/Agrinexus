import React from "react";
import { useNavigate } from "react-router-dom"; // Import the hook to navigate

const Button = ({ children, className, variant, onClick, to }) => {
  const navigate = useNavigate(); // Use navigate hook to programmatically navigate

  // Define the classNames for button styling
  const classNames = `btn ${
    variant === "outline" ? "btn-outline" : "btn-solid"
  } ${className || ""}`;

  // Handle the click for navigation
  const handleClick = () => {
    if (to) {
      navigate(to); // Navigate to the provided 'to' path
    }
    if (onClick) {
      onClick(); // Execute additional onClick actions if provided
    }
  };

  return (
    <button className={classNames} onClick={handleClick}>
      {children}
    </button>
  );
};

export { Button };
