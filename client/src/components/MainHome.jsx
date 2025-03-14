import "./MainHome.css";
import axios from "../utils/axios";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { Link } from "react-router-dom";

const MainHome = () => {
  const [product, setProduct] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.post("/product/create");
      setProduct(response.data.products);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const orderProduct = async (productId, productName) => {
    const userId = localStorage.getItem("ID");

    if (!userId) {
      message.error("User not logged in");
      return;
    }

    try {
      const response = await axios.post("/order/create", {
        userId,
        items: [{ productId, name: productName, quantity: 1 }],
      });
      message.success("Order placed successfully!");
      console.log("Order response:", response.data);
    } catch (error) {
      message.error("Error placing order");
      console.error("Order error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="main-home">
      <div className="seperator">
        <div className="main-contents">
          <p onClick={fetchProducts}>Get Products</p>
          <Link className="hom" to={`/orders/${localStorage.getItem("ID")}`}>
            Orders
          </Link>
        </div>

        <div className="products-list">
          {product.length > 0 ? (
            <div className="list">
              {product.map((product) => (
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
    </div>
  );
};

export default MainHome;
