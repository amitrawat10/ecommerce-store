import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductDetails,
  clearErrors,
  newReview,
} from "../../actions/productAction";
import { useParams } from "react-router";
import { Rating } from "@material-ui/lab";
import ReviewCard from "./reviewCard";
import "./productDetails.css";
import Loader from "../layout/loader/Loader";
import { useAlert } from "react-alert";
import { NEW_REVIEW_RESET } from "../../constants/productConstant";
import { addItemsToCart } from "../../actions/cartAction";
import { NavLink } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const alert = useAlert();
  const { product, loading, error, similarProducts } = useSelector(
    (state) => state.productDetails
  );

  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, alert, error, reviewError, success]);

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const increaseQty = () => {
    if (product.stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };
  const decreaseQty = () => {
    if (1 >= quantity) return;
    const qty = quantity - 1;
    setQuantity(qty);
  };
  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item added to cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);
    dispatch(newReview(myForm));
    setOpen(false);
  };

  const similarProductsOptions = {
    readOnly: true,
    precision: 0.5,
    value: product.ratings,
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <div className="imgContainer">
                      <img
                        className="CarouselImage"
                        key={i}
                        src={item.url}
                        alt={`${i} Slide`}
                      />
                    </div>
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                {/* <h2 className="productMRP">{`₹${product.mrp}`}</h2> */}
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQty}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQty}>+</button>
                  </div>
                  <button
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? " Out of stock" : " In Stock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button className="submitReview" onClick={submitReviewToggle}>
                Submit Review
              </button>
            </div>
          </div>
          <h3 className="reviewsHeading">REVIEWS</h3>
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              {" "}
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />
              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews.map &&
                product.reviews.map((review) => <ReviewCard review={review} />)}
            </div>
          ) : (
            <p className="noReviews">No reivews yet</p>
          )}

          {similarProducts.length > 0 && (
            <>
              <h3 className="similarHeading">Similar Products</h3>
              <div className="similarProductsContainer">
                {similarProducts.map((similar) => (
                  <NavLink to={`/product/${similar._id}`} key={similar._id}>
                    <div className="similarProductCard">
                      <div className="similarProductCard-up">
                        <img src={similar.images[0].url} alt="img" />
                      </div>
                      <div className="similarProductCard-down">
                        <p className="similarName">{similar.name}</p>
                        <strong className="similarPrice">
                          ₹ {similar.price}
                        </strong>
                        {similar.ratings > 0 && (
                          <p className="similarRating">
                            <Rating
                              readOnly={true}
                              precision={0.5}
                              value={similar.ratings}
                            />
                            <span className="numOfReviewsSimilar">
                              ({similar.numOfReviews})
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProductDetails;
