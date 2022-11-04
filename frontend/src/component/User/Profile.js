import { useEffect } from "react";
import Loader from "../layout/loader/Loader";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./Profile.css";
import { useNavigate, NavLink } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${user.name}'s Profile`} />
          <div className="profileContainer">
            <div>
              <h1>My Profile</h1>
              <img src={user.avatar.url} alt="user profile img" />
              <NavLink to="/me/update">Edit Profile</NavLink>
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                <p>{user.name}</p>
              </div>{" "}
              <div>
                <h4>Email</h4>
                <p>{user.email}</p>
              </div>
              <div>
                <h4>Joined On</h4>
                <p>{user.createdAt.toString().substr(0, 10)}</p>
              </div>
              <div>
                <NavLink to="/orders">My Orders</NavLink>
                <NavLink to="/password/update">Change Password</NavLink>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
