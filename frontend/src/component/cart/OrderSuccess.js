import "./OrderSuccess.css";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="orderSuccess">
      <CheckCircleIcon />
      <Typography>Your Order has been placed successfully</Typography>
      <NavLink to="/orders">View Orders</NavLink>
    </div>
  );
};

export default OrderSuccess;
