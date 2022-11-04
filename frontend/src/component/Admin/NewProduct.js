import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../constants/productConstant";
import "./newProduct.css";
const categories = [
  "Computer & Laptops",
  "Men's wear",
  "Women's wear",
  "Electronics",
  "Home Appliances",
  "Kitchen Appliances",
  "Beauty & Makeup",
  "Mobiles & Earphones",
  "Men's Grooming",
  "Women's Grooming",
  "TV & LCDs",
];
const NewProduct = () => {
  // states
  const [name, setName] = useState("");
  const [mrp, setMrp] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.newProduct);
  const alert = useAlert();
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Product created successfully");
      navigate("/admin/products");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, success, navigate, alert]);

  const createProductSubmitHandler = (e) => {
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

    dispatch(createProduct(myForm));
  };

  const createProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
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
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>
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
              <select onChange={(e) => setCategory(e.target.value)}>
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
                onChange={createProductImageChange}
                multiple
              />
            </div>
            <div id="createProductFormImage">
              {imagesPreview.map((img, i) => (
                <img key={i} src={img} alt="Product preview" />
              ))}
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

export default NewProduct;
