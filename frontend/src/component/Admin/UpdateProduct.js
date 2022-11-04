import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstant";
import "./updateProduct.css";
const categories = [
  "Computer & Laptops",
  "Men's wear",
  "Women's wear",
  "Electronics",
  "Home Appliances",
  "Kitchen Appliances",
  "Beauty & Makeup",
  "Mobiles & Earphones",
  "TV & LCDs",
  "Bags & bagpacks",
  "Men's Grooming",
  "Women's Grooming",
  "Cleaners",
];
const UpdateProduct = () => {
  // states
  const [name, setName] = useState("");
  const [mrp, setMrp] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // product id from url
  const { id: productId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, product } = useSelector((state) => state.productDetails);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);
  const alert = useAlert();
  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setMrp(product.mrp);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      setOldImages(product.images);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Product updated successfully");
      navigate("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [
    dispatch,
    error,
    navigate,
    alert,
    updateError,
    productId,
    product,
    isUpdated,
  ]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("mrp", mrp);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    images.forEach((img) => {
      myForm.append("images", img);
    });

    dispatch(updateProduct(productId, myForm));
  };

  const updateProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    setOldImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };
  return (
    <>
      <MetaData title="Create a Product" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipar/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Update Product</h1>
            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Product MRP"
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Product Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <DescriptionIcon />
              <textarea
                placeholder="Product Description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>
            <div>
              <AccountTreeIcon />
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Product Stock"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProductImageChange}
                multiple
              />
            </div>
            <div id="createProductFormImage">
              {oldImages.map((img, i) => (
                <img key={i} src={img.url} alt="old Product preview" />
              ))}
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((img, i) => {
                <img key={i} src={img} alt="new product perview" />;
              })}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Create Product
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
