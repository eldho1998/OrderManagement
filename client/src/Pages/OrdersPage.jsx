import './OrdersPage.css';
import axios from '../utils/axios';
import { useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCallback } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const openModal = _id => {
    setSelectedOrderId(_id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrderId(null);
  };

  const fetchOrders = useCallback(async () => {
    const userId = localStorage.getItem('ID');
    if (!userId) {
      messageApi.open({
        type: 'error',
        content: 'You are not Authorized!',
      });
      return;
    }

    try {
      const response = await axios.get(`/order/${userId}`);
      console.log('Orders:', response.data.order);
      setOrders(response.data.order);
      messageApi.open({
        type: 'success',
        content: 'Your Orders!',
      });
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: 'error',
        content: 'Unable to load Orders now!',
      });
    }
  }, [messageApi]);

  const deleteOrder = async () => {
    if (!selectedOrderId) return;
    try {
      await axios.delete(`/order/${selectedOrderId}`);
      setOrders(orders.filter(order => order._id !== selectedOrderId));
      messageApi.open({
        type: 'success',
        content: 'Order deleted successfully!',
      });
    } catch (e) {
      console.log(e);
      messageApi.open({ type: 'error', content: 'Failed to delete order!' });
    }

    closeModal();
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
              <h4>Items:</h4>
              <div>
                {order.items.map(item => {
                  const product =
                    item.productId && typeof item.productId === 'object'
                      ? item.productId
                      : item;
                  return (
                    <div key={item._id} className="order-item">
                      <p>
                        <strong>Product ID:</strong> {product?._id || 'N/A'}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Name:</strong> {product?.name || 'N/A'}
                      </p>
                      <p>
                        <strong>Price:</strong> ${product?.price || 'N/A'}
                      </p>
                      <div className="image">
                        {product.image ? (
                          <img
                            src={`/products/${product.image}`}
                            alt={product.name || 'Product'}
                            className="product-image"
                          />
                        ) : (
                          <p>No Image Available</p>
                        )}
                        <div
                          onClick={() => openModal(order._id)}
                          className="delete"
                        >
                          <DeleteOutlined />
                        </div>
                        <Modal
                          title="Confirm Delete!"
                          open={modalOpen}
                          onOk={deleteOrder}
                          onCancel={closeModal}
                        >
                          <p>Are you sure you want to delete the order?</p>
                        </Modal>
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
