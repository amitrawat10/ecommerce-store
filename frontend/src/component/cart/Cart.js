import "./cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const increaseQty = (id, qty, stock) => {
    const newQty = qty + 1;
    if (stock <= qty) return;
    dispatch(addItemsToCart(id, newQty));
  };
  const decreaseQty = (id, qty) => {
    const newQty = qty - 1;
    if (1 >= qty) return;
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };
  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
    // navigate("/shipping");
  };
  return (
    <>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>No products in your cart</Typography>
          <NavLink to="/products">View Products</NavLink>
        </div>
      ) : (
        <>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>
            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="cartInput">
                    <button onClick={() => decreaseQty(item.product, item.qty)}>
                      -
                    </button>
                    <input type="number" readOnly value={item.qty} />
                    <button
                      onClick={() => {
                        increaseQty(item.product, item.qty, item.stock);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">{`₹ ${item.price * item.qty}`}</p>
                </div>
              ))}
            <div className="cartGrossTotal">
              <div></div>
              <div className="cartGrossTotalBox">
                <p>Gross Total</p>
                <p>{`₹${cartItems.reduce(
                  (acc, item) => acc + item.qty * item.price,
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkoutBtn">
                <button onClick={checkoutHandler}>Check out</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
