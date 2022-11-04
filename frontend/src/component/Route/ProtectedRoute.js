import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const ProtectedRoute = ({
  element: Component,
  comp,
  stripeApiKey,
  isAdmin,
}) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  return (
    <>
      {loading === false &&
        (!isAuthenticated ? (
          <Navigate to="/login" />
        ) : comp === "payment" ? (
          stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Component />
            </Elements>
          )
        ) : isAdmin === true ? (
          user.role === "admin" ? (
            <Component />
          ) : (
            <Navigate to="/login" />
          )
        ) : (
          <Component />
        ))}
    </>
  );
};

export default ProtectedRoute;
// isAdmin === true &&
// (user.role !== "admin" ? <Navigate to="/login" /> : <Component />)
