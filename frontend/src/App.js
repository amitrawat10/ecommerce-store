import "./App.css";
import { useEffect, useState } from "react";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/home/Home";
import WebFont from "webfontloader";
import ProductDetails from "./component/product/productDetails";
import Search from "./component/product/Search";
import Products from "./component/product/Products";
import LoginSignup from "./component/User/LoginSignup";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UserOption from "./component/layout/Header/UserOption";
import store from "./store";
import axios from "axios";
import { loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePasswrod from "./component/User/UpdatePasswrod";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/cart/Cart";
import Shipping from "./component/cart/Shipping";
import OrderSuccess from "./component/cart/OrderSuccess";
import OrderDetails from "./component/order/OrderDetails";
import MyOrders from "./component/order/MyOrders";
import Payment from "./component/cart/Payment";
import ConfirmOrder from "./component/cart/ConfirmOrder";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UserList from "./component/Admin/UserList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/NotFound/NotFound";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Formular", "Rubik", "Roboto", "Lato", "Raleway"],
      },
    });
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);
  return (
    <div className="app">
      <Router>
        <Header />
        {isAuthenticated && <UserOption user={user} />}
        <Routes>
          <Route
            path="*"
            element={
              window.location.pathname === "/process/payment" ? null : (
                <NotFound />
              )
            }
          />
          {stripeApiKey && (
            <Route
              path="/process/payment"
              element={
                <ProtectedRoute
                  element={Payment}
                  comp="payment"
                  stripeApiKey={stripeApiKey}
                />
              }
            />
          )}
          <Route
            path="/process/payment"
            element={<ProtectedRoute element={Payment} comp="payment" />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route
            path="/account"
            element={<ProtectedRoute element={Profile} />}
          />
          <Route
            path="/me/update"
            element={<ProtectedRoute element={UpdateProfile} />}
          />
          <Route
            path="/password/update"
            element={<ProtectedRoute element={UpdatePasswrod} />}
          />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/shipping"
            element={<ProtectedRoute element={Shipping} />}
          />
          <Route
            path="/order/confirm"
            element={<ProtectedRoute element={ConfirmOrder} />}
          />

          <Route
            path="/success"
            element={<ProtectedRoute element={OrderSuccess} />}
          />

          <Route
            path="/orders"
            element={<ProtectedRoute element={MyOrders} />}
          />

          <Route
            path="/order/:id"
            element={<ProtectedRoute element={OrderDetails} />}
          />

          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute element={Dashboard} isAdmin={true} />}
          />

          <Route
            path="/admin/products"
            element={<ProtectedRoute element={ProductList} isAdmin={true} />}
          />
          <Route
            path="/admin/product"
            element={<ProtectedRoute element={NewProduct} isAdmin={true} />}
          />
          <Route
            path="/admin/product/:id"
            element={<ProtectedRoute element={UpdateProduct} isAdmin={true} />}
          />

          <Route
            path="/admin/orders"
            element={<ProtectedRoute element={OrderList} isAdmin={true} />}
          />
          <Route
            path="/admin/order/:id"
            element={<ProtectedRoute element={ProcessOrder} isAdmin={true} />}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute element={UserList} isAdmin={true} />}
          />
          <Route
            path="/admin/user/:id"
            element={<ProtectedRoute element={UpdateUser} isAdmin={true} />}
          />
          <Route
            path="/admin/reviews"
            element={<ProtectedRoute element={ProductReviews} isAdmin={true} />}
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
