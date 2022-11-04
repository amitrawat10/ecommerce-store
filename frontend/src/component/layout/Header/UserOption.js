import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";

const UserOption = ({ user }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const alert = useAlert();
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart ${cartItems.length}`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    naviagte("/admin/dashboard");
  }
  function orders() {
    naviagte("/orders");
  }
  function account() {
    naviagte("/account");
  }
  function cart() {
    naviagte("/cart");
  }
  function logoutUser() {
    dispatch(logout());
    alert.success("logout successfully");
    naviagte("/login");
  }

  return (
    <>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        direction="down"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        className="speedDial"
        style={{ zIndex: "11" }}
        open={open}
        icon={
          <img
            className="speedDialIcon"
            alt="Profile"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
          />
        }
      >
        {options.map((option) => (
          <SpeedDialAction
            key={option.name}
            icon={option.icon}
            tooltipTitle={option.name}
            onClick={option.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default UserOption;
