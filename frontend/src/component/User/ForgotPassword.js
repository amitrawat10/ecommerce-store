import { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { forgotPassword, clearErrors } from "../../actions/userAction";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/loader/Loader";
import "./ForgotPassword.css";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("email", email);
    dispatch(forgotPassword(formData));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      alert.success(message);
    }
  }, [dispatch, alert, error, message]);

  return (
    <>
      {loading} ? (<Loader />) : (
      <>
        <MetaData title="Forgot Password" />
        <div className="forgotPasswordContainer">
          <div className="forgotPasswordBox">
            <h2 className="forgotPasswordHeading">Forgot Password</h2>
            <form
              className="forgotPasswordForm"
              onSubmit={forgotPasswordSubmit}
            >
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <input
                type="submit"
                value="Send Reset Link"
                className="forgotPasswordBtn"
              />
            </form>
          </div>
        </div>
      </>
      )
    </>
  );
};
export default ForgotPassword;
