import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { NavLink } from "react-router-dom";
import { Typography } from "@material-ui/core";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import { useAlert } from "react-alert";
import Loader from "../layout/loader/Loader";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstant";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { useParams } from "react-router-dom";
import "./processOrder.css";
import {
  updateOrder,
  clearErrors,
  getOrderDetails,
} from "../../actions/orderAction";
const ProcessOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();
  //   let loading = false;
  const { error, order, loading } = useSelector((state) => state.orderDetails);
  const { isUpdated, error: updateError } = useSelector((state) => state.order);
  // states
  const [status, setStaus] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order status updated");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error, updateError, id, isUpdated]);
  const processOrderHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("status", status);
    dispatch(updateOrder(id, myForm)); // update order status
  };
  return (
    <>
      <MetaData title="Order Process" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <div className="confirmOrderPage">
              <div>
                <div className="confirmShippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order.user && order.user.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>
                        {order.shippingInfo && order.shippingInfo.phoneNo}
                      </span>
                    </div>
                    <div>
                      <p>Address</p>
                      <span>
                        {order.shippingInfo &&
                          `${order.shippingInfo.address},${order.shippingInfo.city},${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>
                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Status: </p>
                      <span
                        className={
                          order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </span>
                    </div>
                    <div>
                      <p>Amount:</p>
                      <span>{order.totalPrice && order.totalPrice}</span>
                    </div>
                  </div>
                  <div className="order-status-container">
                    <Typography>Order Status </Typography>
                    <div className="orderDetailsContainerBox">
                      <div
                        className={
                          order.orderStatus && order.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redcolor"
                        }
                      >
                        <p className="order_Status_p">
                          {order.orderStatus && order.orderStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Your Cart Items: </Typography>
                  <div className="confirmCartItemsContainer">
                    {order.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.product}>
                          <img src={item.image} alt="order image" />
                          <NavLink to={`/product/${item.product}`}>
                            {item.name}
                          </NavLink>
                          <span>
                            {item.qty}X {item.price} ={" "}
                            <strong>₹{item.price * item.qty}</strong>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: order.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={processOrderHandler}
                >
                  <h1 className="orderUpdateFormHeading">Process Order</h1>
                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStaus(e.target.value)}>
                      <option value="">Update Order Status</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                      loading ? true : false || status === "" ? true : false
                    }
                  >
                    Update Status
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProcessOrder;
