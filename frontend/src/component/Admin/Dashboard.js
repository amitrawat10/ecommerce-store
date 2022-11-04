import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProducts } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  registerables,
} from "chart.js";
import MetaData from "../layout/MetaData";
const Dashboard = () => {
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    ...registerables
  );
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUser);
  let outOfStock = 0;
  products &&
    products.forEach((item) => {
      if (item.stock === 0) outOfStock++;
    });

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);
  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: "rgba(75,192,192,0.2)",
        data: [0, totalAmount],
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        data: [outOfStock, products.length - outOfStock],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        backgroundColor: ["#00A6B4", "#6800B4"],
      },
    ],
  };
  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />
      <div className="dashboardContainer">
        <Typography component="h1">Dashboard Analytics</Typography>
        <div className="dashboardSummary">
          <div className="summaryHeadingBox">
            <p>Total Sales</p>
            <p>98989</p>
          </div>
          <div className="dashboardSummaryBox2">
            <NavLink to="/admin/products">
              <p className="first-in-link">Products</p>
              <p>{products && products.length}</p>
            </NavLink>
            <NavLink to="/admin/orders">
              <p className="first-in-link">Orders</p>
              <p>{orders && orders.length}</p>
            </NavLink>
            <NavLink to="/admin/users">
              <p className="first-in-link">Users</p>
              <p>{users && users.length}</p>
            </NavLink>
          </div>
        </div>

        <div className="chartContainer">
          <div className="lineChart">
            <Line data={lineState} />
          </div>
          <div className="doughnutChart">
            <Doughnut data={doughnutState} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
