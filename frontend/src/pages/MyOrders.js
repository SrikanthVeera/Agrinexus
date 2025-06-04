import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/orders/my-orders/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(res.data);
      } catch (err) {
        setError("Failed to fetch orders.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>My Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id || order._id} style={{ marginBottom: 16, border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
            <div><b>Order ID:</b> {order.id || order._id}</div>
            <div><b>Total:</b> {order.totalPrice || order.totalAmount}</div>
            <div><b>Status:</b> {order.status || "N/A"}</div>
            {/* Add more order details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyOrders; 