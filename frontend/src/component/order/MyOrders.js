import { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./MyOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/loader/Loader";
import { NavLink } from "react-router-dom";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@material-ui/icons/Launch";
const MyOrders = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user } = useSelector((state) => state.user);
  const { loading, error, orders } = useSelector((state) => state.myOrders);
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [alert, error, dispatch]);
  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 200, flex: 0.2 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.2,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    { field: "ItemsQty", headerName: "Items Qty", minWidth: 200, flex: 0.2 },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 200,
      flex: 0.2,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.2,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <NavLink to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </NavLink>
        );
      },
    },
  ];
  const rows = [];

  {
    orders &&
      orders.forEach((item, index) => {
        rows.push({
          ItemsQty: item.orderItems.length,
          id: item._id,
          status: item.orderStatus,
          amount: item.totalPrice,
        });
      });
  }
  return (
    <>
      <MetaData title={`${user.name} - Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="myOrdersTable"
            autoHeight
          />
          <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
        </div>
      )}
    </>
  );
};

export default MyOrders;
