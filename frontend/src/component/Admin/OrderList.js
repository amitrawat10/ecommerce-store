import React, { useEffect } from "react";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Sidebar";
import { DataGrid } from "@material-ui/data-grid";
import { useNavigate } from "react-router-dom";
import {
  getAllOrders,
  clearErrors,
  deleteOrder,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstant";
const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { error: deleteError, isDeleted } = useSelector((state) => state.order);
  const { error, orders } = useSelector((state) => state.allOrders);
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Order deleted successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  const deleteOrderHandler = (oid) => {
    dispatch(deleteOrder(oid));
  };
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 0.6 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.4,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 100,
      flex: 0.4,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.9,
      headerName: "Actions",
      minWidth: 300,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <NavLink
              to={`/admin/order/${params.getValue(params.id, "id")}`}
              className="editIcon"
            >
              <EditIcon />
            </NavLink>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];

  let rows = [];

  orders &&
    orders.forEach((order) => {
      rows.push({
        id: order._id,
        itemsQty: order.orderItems.length,
        amount: order.totalPrice,
        status: order.orderStatus,
      });
    });
  return (
    <>
      <MetaData title={`ALL ORDERS - Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </>
  );
};

export default OrderList;
