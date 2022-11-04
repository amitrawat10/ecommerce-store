import { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { resetPassword, clearErrors } from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/loader/Loader";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";
const ResetPassword = () => {
  const [password, setPasssword] = useState("");
  const [confirmPassword, setConfirmPasssword] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { token } = useParams();

  const { loading, error, success } = useSelector(
    (state) => state.forgotPassword
  );

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(token, formData));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Password has been changed successfully");
      navigate("/login");
    }
  }, [dispatch, alert, error, success, navigate]);

  return (
    <>
      {loading} ? (<Loader />) : (
      <>
        <MetaData title="Reset Password" />
        <div className="resetPasswordContainer">
          <div className="resetPasswordBox">
            <h2 className="resetPasswordHeading">Reset Password</h2>
            <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
              <div>
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPasssword(e.target.value)}
                />
              </div>
              <div>
                <LockIcon />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPasssword(e.target.value)}
                />
              </div>
              <input
                type="submit"
                value="Change Password"
                className="resetPasswordBtn"
              />
            </form>
          </div>
        </div>
      </>
      )
    </>
  );
};
export default ResetPassword;
