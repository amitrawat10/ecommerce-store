import CheckoutSteps from "../cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import { NavLink } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import "./ConfirmOrder.css";

const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const tax = subtotal * 0.18;
  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const totalPrice = subtotal + tax + shippingCharges;
  const address = `${shippingInfo.address}, ${shippingInfo.city},${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  };
  return (
    <>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="product" />
                    <NavLink to={`/product/${item.product}`}>
                      {item.name}
                    </NavLink>
                    <span>
                      {item.qty} X ₹ {item.price} ={" "}
                      <strong>{item.qty * item.price}</strong>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>SubTotal</p>
                <span>{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>
            <div className="orderSummaryTotal">
              <p>
                <strong>Total:</strong>
              </p>
              <span>₹{totalPrice}</span>
            </div>
            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
