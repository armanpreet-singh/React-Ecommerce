import api from "../../api";
import { useState, useEffect,Fragment } from "react";
import dayjs from "dayjs";
import "./OrdersPage.css";
import { Header } from "../../components/Header";
import { formatMoney } from "../../utils/money";

export function OrdersPage({ cart, loadCart }) {
  const [orders, setOrders] = useState([]);
  const [addingProductIds, setAddingProductIds] = useState([]);
  const [cartFeedback, setCartFeedback] = useState({});

  const addToCart = async (productId) => {
    if (addingProductIds.includes(productId)) return;

    setAddingProductIds((currentIds) => [...currentIds, productId]);
    setCartFeedback((currentFeedback) => ({
      ...currentFeedback,
      [productId]: '',
    }));

    try {
      await api.post('/api/cart-items', { productId, quantity: 1 });
    } catch {
      setCartFeedback((currentFeedback) => ({
        ...currentFeedback,
        [productId]: 'Could not add this product. Please try again.',
      }));
      setAddingProductIds((currentIds) =>
        currentIds.filter((id) => id !== productId)
      );
      return;
    }

    try {
      await loadCart();
      setCartFeedback((currentFeedback) => ({
        ...currentFeedback,
        [productId]: 'Added to cart.',
      }));
    } catch {
      setCartFeedback((currentFeedback) => ({
        ...currentFeedback,
        [productId]: 'Added, but the cart count could not be refreshed.',
      }));
    } finally {
      setAddingProductIds((currentIds) =>
        currentIds.filter((id) => id !== productId)
      );
    }
  };
  useEffect(() => {
    api.get("/api/orders?expand=products").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <>
      <title>Orders</title>
      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {orders.map((order) => {
            return (
              <>
                <div key={order.id} className="order-container">
                  <div className="order-header">
                    <div className="order-header-left-section">
                      <div className="order-date">
                        <div className="order-header-label">Order Placed:</div>
                        <div>{dayjs(order.orderTimeMs).format('MMMM D')}</div>
                      </div>
                      <div className="order-total">
                        <div className="order-header-label">Total:</div>
                        <div>{formatMoney(order.totalCostCents)}</div>
                      </div>
                    </div>

                    <div className="order-header-right-section">
                      <div className="order-header-label">Order ID:</div>
                      <div>{order.id}</div>
                    </div>
                  </div>

                  <div className="order-details-grid">
                    {order.products.map((orderProduct)=>{
                      return (
                        <Fragment key={orderProduct.product.id}>
  <div className="product-image-container">
                      <img src={orderProduct.product.image} />
                    </div>

                    <div className="product-details">
                      <div className="product-name">
                        {orderProduct.product.name}
                      </div>
                      <div className="product-delivery-date">
                        Arriving on : {dayjs(orderProduct.estimatedDeliveryTimeMs).format('MMMM D')} 
                      </div>
                      <div className="product-quantity">Quantity : {orderProduct.quantity}</div>
                      <button
                        type="button"
                        className="buy-again-button button-primary"
                        onClick={() => addToCart(orderProduct.product.id)}
                        disabled={addingProductIds.includes(orderProduct.product.id)}
                      >
                        <img
                          className="buy-again-icon"
                          src="images/icons/buy-again.png"
                          alt=""
                        />
                        <span className="buy-again-message">
                          {addingProductIds.includes(orderProduct.product.id)
                            ? 'Adding...'
                            : 'Add to Cart'}
                        </span>
                      </button>
                      {cartFeedback[orderProduct.product.id] && (
                        <p className="buy-again-feedback" role="status" aria-live="polite">
                          {cartFeedback[orderProduct.product.id]}
                        </p>
                      )}
                    </div>

                    <div className="product-actions">
                      <a href="/tracking">
                        <button className="track-package-button button-secondary">
                          Track package
                        </button>
                      </a>
                    </div>
                        </Fragment>
                      )
                    })}
                 

                  </div>
                </div>
              </>
            );
          })}

       
        </div>
      </div>
    </>
  );
}
