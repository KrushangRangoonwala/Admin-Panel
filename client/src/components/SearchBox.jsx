import React from "react";
import "./SearchBox.css";
// import { FaSearch } from "react-icons/fa";

const SearchBox = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="search-box">
      {/* <FaSearch className="search-icon" /> */}
      <i class="bi bi-search search-icon"></i>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
};

export default SearchBox;
