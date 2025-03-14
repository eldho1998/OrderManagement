import './OrdersPage.css';
import axios from '../utils/axios';
import { useEffect, useState } from 'react';
import { message } from 'antd';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchOrders = async () => {
    const userId = localStorage.getItem('ID');
    if (!userId) {
      messageApi.open({
        type: 'error',
        content: 'You are not logged In!',
      });
      return;
    }

    try {
      const response = await axios.get(`/order?userId=${userId}`);
      console.log('Orders:', response.data.order);
      setOrders(response.data.order);
      messageApi.open({
        type: 'success',
        content: 'Your Orders!',
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Unable to load Orders now!',
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="ordersPage">
      <h2>Your Orders</h2>
      {contextHolder}
      <div className="order-lists">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order._id} className="order-card">
              <h3>Order Status: {order.status}</h3>
              <p>
                <strong>Order ID:</strong> {order.orderId}
              </p>
              <p>
                <strong>Total Price:</strong> ${order.totalPrice}
              </p>
              <h4>Items:</h4>
              <div>
                {order.items.map(item => {
                  const product = item.productId || {};
                  return (
                    <div key={item._id} className="order-item">
                      <p>
                        <strong>Product ID:</strong> {product._id || 'N/A'}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Name:</strong> {product.name || 'N/A'}
                      </p>
                      <div className="image">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name || 'Product'}
                            className="product-image"
                          />
                        ) : (
                          <p>No Image Available</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
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
