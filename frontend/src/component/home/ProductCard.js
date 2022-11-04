import React from "react";
import { NavLink } from "react-router-dom";
import { Rating } from "@material-ui/lab";

const ProductCard = ({ product }) => {
  const options = {
    readOnly: true,
    precision: 0.5,
    value: product.ratings,
  };
  return (
    <NavLink className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div className="productReview_wrapper">
        <Rating {...options} />
        <span className="productCardSpan">
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span className="productCard-price">{`₹${product.price}`}</span>
    </NavLink>
  );
};

export default ProductCard;
