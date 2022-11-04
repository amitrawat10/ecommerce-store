import { useState } from "react";
import "./Search.css";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate(`/products`);
    }
  };
  return (
    <>
      <MetaData title="Search Product" />
      <div className="searchContainer">
        <form className="searchBox" onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Search for a product"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input type="submit" value="Search" />
        </form>
      </div>
    </>
  );
};

export default Search;
