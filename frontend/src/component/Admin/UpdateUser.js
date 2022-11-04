import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import Sidebar from "./Sidebar";
import { UPDATE_USER_RESET } from "../../constants/userConstant";

import {
  getUserDetails,
  updateUser,
  clearErrors,
} from "../../actions/userAction";
import Loader from "../layout/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const { loading, error, user } = useSelector((state) => state.userDetails);
  const {
    error: updateError,
    isUpdated,
    loading: updateLoading,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    if (user && user._id !== id) {
      dispatch(getUserDetails(id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error("Unable to update user");
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("User updated");
      navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, error, updateError, isUpdated, alert, navigate, id, user]);

  const updateUserHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(id, myForm));
  };
  return (
    <>
      <MetaData title="Update User" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <form className="createProductForm" onSubmit={updateUserHandler}>
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <Button
                id="createProductBtn"
                type="submit"
                disabled={
                  updateLoading ? true : false || role === "" ? true : false
                }
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
