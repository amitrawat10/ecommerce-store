import React, { useEffect } from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, clearErrors } from "../../actions/productAction";
import ProductCard from "./ProductCard";
import { useAlert } from "react-alert";
import Loader from "../layout/loader/Loader";
import MetaData from "../layout/MetaData";
const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProducts());
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="MyEcom" />
          <div className="banner">
            <p>Welcome to myecom</p>
            <h1>Get Deals like never before</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
