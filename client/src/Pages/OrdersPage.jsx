import "./OrdersPage.css";
import axios from "../utils/axios";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useParams } from "react-router-dom";

const OrdersPage = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const userId = localStorage.getItem("ID");
    if (!userId) {
      message.error("User not logged in");
      return;
    }

    try {
      const response = await axios.get(`/order/lists?userId=${userId}`);
      console.log("Orders:", response.data);
      setOrders(response.data);
    } catch (error) {
      message.error("Error fetching orders");
      console.error("Order fetch error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  return (
    <div className="ordersPage">
      <h2>Your Orders</h2>
      <div className="order-lists">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order ID: {order._id}</h3>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total Price:</strong> ${order.totalPrice}
              </p>
              <h4>Items:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId._id}>
                    {item.productId.name} - ${item.productId.price} x{" "}
                    {item.quantity}
                  </li>
                ))}
              </ul>
              <Button type="primary">View Details</Button>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
