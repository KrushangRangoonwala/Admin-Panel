import React, { useEffect } from "react";
import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useNavigate } from "react-router";

export default function ProductGridTable({
  products,
  selectedProductOfAllPage,
  handleCheckBoxClick,
  imageReader,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("productCheck", (e) => handleCheckBoxClick(e.detail));
    document.addEventListener("productNavigate", (e) => navigate(`/product/${e.detail.id}`));
    return () => {
      document.removeEventListener("productCheck", handleCheckBoxClick);
      document.removeEventListener("productNavigate", navigate);
    };
  }, [products]);

  if (!products || products.length === 0) {
    return <p className="no-record">No Record Found</p>;
  }

  const columns = [
    html(`<input type="checkbox" disabled />`), // Select All can be wired later
    "Image",
    "Product Name",
    "Category",
    "MRP (₹)",
    "Sale Price (₹)",
    "Status",
    "Weight (g)",
  ];

  const data = products.map((prod, i) => [
    // Checkbox
    html(`
      <input 
        type="checkbox" 
        value="${prod._id}" 
        ${selectedProductOfAllPage.includes(prod._id) ? "checked" : ""}
        onclick="event.stopPropagation(); document.dispatchEvent(new CustomEvent('productCheck', { detail: event }))"
      />
    `),

    // Image
    html(`
      <img 
        src="${imageReader(prod, "mainImage")}" 
        alt="${prod.productName}" 
        style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;" 
      />
    `),

    // Product Name (clickable)
    html(`
      <span style="cursor: pointer; color: #3870eb;" 
        onclick="document.dispatchEvent(new CustomEvent('productNavigate', { detail: { id: '${prod._id}' } }))">
        ${prod.productName}
      </span>
    `),

    // Category
    prod.categoryName || "—",

    // MRP
    `₹${prod.mrpPrice}`,

    // Sale Price
    `₹${prod.salePrice}`,

    // Status
    prod.status === "active"
      ? html(`<span style="color: green;">Active</span>`)
      : html(`<span style="color: red;">Inactive</span>`),

    // Weight
    prod.weight ? `${prod.weight}g` : "—",
  ]);

  return (
    <div className="p-4">
      <Grid
        columns={columns}
        data={data}
        pagination={{ limit: 5 }}
        search={true}
        sort={true}
      />
    </div>
  );
}
