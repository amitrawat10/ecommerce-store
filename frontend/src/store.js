import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productsReducer,
  productDetailsReducer,
  productCategoryReducer,
  productReducer,
  newReviewReducer,
  newProductReducer,
  reviewReducer,
  productReviewsReducer,
} from "./reducers/productsReducer";

import {
  userReducer,
  profileReducer,
  forgotPassword,
  allUsersReducer,
  userDetailsReducer,
} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import {
  allOrdersReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
} from "./reducers/orderReducer";
const reducer = combineReducers({
  products: productsReducer, // all
  productDetails: productDetailsReducer,
  productCategory: productCategoryReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPassword,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  newReview: newReviewReducer,
  product: productReducer, // single, updation, deletion
  newProduct: newProductReducer,
  allOrders: allOrdersReducer,
  order: orderReducer, // updation,deletion
  allUser: allUsersReducer,
  userDetails: userDetailsReducer,
  review: reviewReducer,
  productReviews: productReviewsReducer,
});

const middleware = [thunk];
let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
