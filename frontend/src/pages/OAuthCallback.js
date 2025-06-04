import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Example: http://localhost:3000/oauth-callback?token=JWT_TOKEN
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Optionally, fetch user profile here
      navigate("/dashboard");
    } else {
      // Handle error or show message
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg text-green-700 font-bold">Logging you in...</div>
    </div>
  );
};

export default OAuthCallback; 