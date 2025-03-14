import './MainHome.css';
import axios from '../utils/axios';
import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { Link } from 'react-router-dom';

const MainHome = () => {
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/product/create?page=${page}&limit=6`);
      setProduct(response.data.products);
      setTotalPages(response.data.totalPages);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const orderProduct = async (productId, productName) => {
    const userId = localStorage.getItem('ID');

    if (!userId) {
      message.error('User not logged in');
      return;
    }

    try {
      const response = await axios.post('/order/create', {
        userId,
        items: [{ productId, name: productName, quantity: 1 }],
      });
      message.success('Order placed successfully!');
      console.log('Order response:', response.data);
    } catch (error) {
      message.error('Error placing order');
      console.error('Order error:', error);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div className="main-home">
      <div className="seperator">
        <div className="main-contents">
          <p onClick={fetchProducts}>Get Products</p>
          <Link className="hom" to={`/orders/${localStorage.getItem('ID')}`}>
            Orders
          </Link>
        </div>

        <div className="products-list">
          {product.length > 0 ? (
            <div className="list">
              {product.map(product => (
                <div className="pro">
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
