import { useEffect, useState } from "react";
import Loader from "../layout/loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, clearErrors } from "../../actions/productAction";
import ProductCard from "../home/ProductCard";
import Pagination from "react-js-pagination";
import { useParams } from "react-router";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import "./Products.css";
const categories = [
  "Computer and Laptops",
  "Computer RAMs",
  "Men's wear",
  "Women's wear",
  "Electronics",
  "Home Appliances",
  "Kitchen Appliances",
  "Beauty and Makeup",
  "Mobiles",
  "Earphones",
  "TV and LCDs",
  "Bags and bagpacks",
  "Men's Grooming",
  "Women's Grooming",
  "Cleaners",
];
const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 200000]);
  const [category, setCategory] = useState("");
  const alert = useAlert();
  const { keyword } = useParams();
  const {
    loading,
    error,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
    selectedCategory,
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProducts(keyword, currentPage, price, category));
  }, [dispatch, error, alert, keyword, currentPage, price, category]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="All Products" />
          <h2 className="productsHeading">All Products</h2>
          <div className="filterBox">
            <div className="price-filter">
              <Typography>Price</Typography>
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                disabled={loading}
                max={200000}
              />
            </div>

            <div className="category-filter">
              <ul className="categoryBox">
                <select
                  className="product-cat-select"
                  id=""
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Choose Product Category</option>
                  {categories.map((category) => (
                    <option
                      key={category}
                      className="category-link"
                      value={category}
                      selected={selectedCategory === category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </ul>
            </div>
          </div>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          {filteredProductsCount <= 0 && (
            <div className="product-not-found">
              <h3>No products found with this category</h3>
            </div>
          )}

          {resultPerPage < filteredProductsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
