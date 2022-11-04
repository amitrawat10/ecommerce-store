import React, { useEffect } from "react";
import MetaData from "../layout/MetaData";
import "./productList.css";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { NavLink } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useNavigate } from "react-router-dom";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstant";

import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "../../actions/productAction";
const ProductList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, products } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Product deleted successfully");
      navigate("/admin/products");
      dispatch(clearErrors());
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProducts());
  }, [dispatch, navigate, alert, error, deleteError, isDeleted]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 180, flex: 0.4 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 0.6,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 50,
      flex: 0.3,
    },

    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 100,
      flex: 0.3,
    },

    {
      field: "actions",
      flex: 0.4,
      headerName: "Actions",
      minWidth: 200,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <NavLink
              to={`/admin/product/${params.getValue(params.id, "id")}`}
              className="editIcon"
            >
              <EditIcon />
            </NavLink>

            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];
  const rows = [];
  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
      });
    });
  return (
    <>
      <MetaData title="All Products - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">All Products</h1>
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

export default ProductList;
