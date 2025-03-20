import './MainHome.css';
import axios from '../utils/axios';
import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { checkUserId } from '../utils/localfunction';

const MainHome = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`/product/create?page=${page}&limit=6`);
      setProduct(response.data.products);
      setTotalPages(response.data.totalPages);
      messageApi.open({
        type: 'success',
        content: 'Here are some products!',
      });
      console.log(response.data);
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Error loading products!',
      });
      console.error('Error fetching products', error);
    }
  }, [page, messageApi]);

  const orderProduct = async (productId, productName) => {
    const userId = localStorage.getItem('ID');

    if (!userId) {
      messageApi.open({
        type: 'error',
        content: 'You are not Authorized!',
      });
      return;
    }

    try {
      const response = await axios.post('/order/create', {
        userId,
        items: [{ productId, name: productName, quantity: 1 }],
      });
      messageApi.open({
        type: 'success',
        content: 'Order placed Successfully! Go to Orders to see your orders',
      });
      console.log('Order response:', response.data);
    } catch (error) {
      if (error.response && error.response.data.error) {
        messageApi.open({
          type: 'error',
          content: error.response.data.error,
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'Error creating Order!',
        });
      }

      console.error('Order error:', error);
    }
  };

  const Logout = async () => {
    const userId = localStorage.getItem('ID');

    if (!userId) {
      messageApi.open({
        type: 'error',
        content: 'User ID not found!',
      });
      return;
    }

    try {
      const response = await axios.post(`/user/logout`, { userId });
      console.log(response);
      messageApi.open({
        type: 'success',
        content: 'Logout Success!',
      });
      localStorage.removeItem('token');
      localStorage.removeItem('ID');
      setTimeout(() => navigate('/'), 2000);
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Log out Failed',
      });
      console.log(e);
    }
  };

  useEffect(() => {
    if (!checkUserId()) {
      navigate('/user/login');
    } else {
      fetchProducts();
    }
  }, [fetchProducts, navigate]);

  return (
    <div className="main-home">
      {contextHolder}
      <div className="seperator">
        <div className="main-contents">
          <p onClick={fetchProducts}>Get Products</p>
          <Link className="hom" to={`/orders/${localStorage.getItem('ID')}`}>
            Orders
          </Link>
          <p onClick={Logout}>LogOut</p>
        </div>

        <div className="products-list">
          {product.length > 0 ? (
            <div className="list">
              {product.map(product => (
                <div className="pro" key={product._id}>
                  <img
                    src={`/products/${product.image}`}
                    alt={product.name}
                    className="product-image"
                  />
                  <h4 key={product.id}>{product.name}</h4>
                  <h5>${product.price}</h5>
                  <p>{product.description}</p>
                  <Button
                    onClick={() => orderProduct(product._id, product.name)}
                  >
                    Order Now
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}{' '}
        </span>
        <button
          onClick={() => setPage(prev => (prev < totalPages ? prev + 1 : prev))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MainHome;
