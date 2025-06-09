import React, { useRef, useState, useEffect } from "react";
import Select from "./Select";
import "./AddProduct2.css";

const Step = ({ index, title, description, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState("0px");

    const toggleOpen = () => {
        if (!isOpen) {
            // Expanding: measure height and set
            setIsOpen(true);
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            // Collapsing: set fixed height first, then 0
            const currentHeight = `${contentRef.current.scrollHeight}px`;
            setMaxHeight(currentHeight);

            requestAnimationFrame(() => {
                setMaxHeight("0px");
                setIsOpen(false);
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        }
    }, [isOpen]);

    return (
        <div className={`step-card ${isOpen ? "open" : ""}`}>
            <div className="step-header" onClick={toggleOpen}>
                <div className="step-title">
                    <div className="step-index">{String(index).padStart(2, "0")}</div>
                    <div>
                        <strong>{title}</strong>
                        <div className="text-gray-500 text-sm">{description}</div>
                    </div>
                </div>
                <div>{isOpen ? <i class="bi bi-chevron-up"></i> : <i class="bi bi-chevron-down"></i>}</div>
            </div>

            <div
                className="step-content-wrapper"
                ref={contentRef}
                style={{ maxHeight }}
            >
                <div className="step-content-inner">{children}</div>
            </div>
        </div>
    );
};

export default function AddProductForm() {
    return (
        <div className="add-product-form">
            <h2>Add Product</h2>
            <form>
                <Step index={1} title="Product Info" description="Fill all information below">
                    <div className="form-container">
                        <div className="form-grid">
                            <div className="form-groupp">
                                <label htmlFor="category">Category</label>
                                <input type="text" id="category" className="form-control" placeholder="Enter category" />
                            </div>

                            <div className="form-groupp">
                                <label htmlFor="subcategory">Subcategory</label>
                                <Select id="subcategory" className="form-control" />
                            </div>

                            <div className="form-groupp">
                                <label htmlFor="productName">Product Name</label>
                                <input type="text" id="productName" className="form-control" placeholder="Enter product name" />
                            </div>

                            <div className="form-groupp">
                                <label htmlFor="weight">Weight</label>
                                <input type="text" id="weight" className="form-control" placeholder="Enter weight" />
                            </div>

                            <div className="form-groupp full-width">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" className="form-control" placeholder="Enter description"></textarea>
                            </div>
                        </div>
                    </div>
                </Step>
                <Step index={2} title="Product Image" description="Fill all information below">
                    <input type="file" />
                </Step>
                <Step index={3} title="Meta Data" description="Fill all information below">
                    <input type="text" placeholder="Meta Title" />
                    <input type="text" placeholder="Meta Keywords" />
                    <textarea placeholder="Meta Description"></textarea>
                </Step>
            </form>
        </div>
    );
}
