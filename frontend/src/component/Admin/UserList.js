import React, { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstant";
import "./productList.css";
const UserList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { error, users } = useSelector((state) => state.allUser);
  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error("Unable to delete user");
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("user has been deleted");
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [
    dispatch,
    error,
    deleteError,
    navigate,
    isDeleted,
    message,
    navigate,
    alert,
  ]);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.5 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.4,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.5,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <NavLink to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </NavLink>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
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
  users &&
    users.forEach((user) => {
      rows.push({
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      });
    });
  return (
    <>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

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

export default UserList;
