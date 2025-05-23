import React from "react";
import "./FilterModal.css";

const FilterModal = ({
    isOpen,
    onClose,
    allCategories,
    allSubcategories,
    selectedCategory,
    selectedSubcategory,
    // onCategoryChange,
    // onSubcategoryChange,
    setSelectedCategory,
    setSelectedSubcategory
}) => {

    async function handleApplyFilter() {
        // const category = allCategories.find(cat => cat.id === selectedCategory);
        // const subcategory = allSubcategories.find(sub => sub.id === selectedSubcategory);

        if (category) {
            // onCategoryChange({ target: { value: category.id } });
            setSelectedCategory(document.getElementById('category').value);
        }
        if (subcategory) {
            // onSubcategoryChange({ target: { value: subcategory.id } });
            setSelectedSubcategory(document.getElementById('subcategory').value);
        }
        onClose();
    }

    async function handleResetFilter() {
        // onCategoryChange({ target: { value: "" } });
        setSelectedCategory('');
        // onSubcategoryChange({ target: { value: "" } });
        setSelectedSubcategory('');
        onClose();
    }

    return (
        <>
            {/* {isOpen ?  */}
            <div className={`filter-modal ${isOpen ? "open" : ""}`}>
                <div className="filter-header">
                    <h2>Filter</h2>
                    <button className="close-button" onClick={onClose}>
                        <i class="bi bi-chevron-left"></i>
                    </button>
                </div>

                <div className="filter-content">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={selectedCategory}
                    // onChange={onCategoryChange}
                    >
                        <option value="">Select Category</option>
                        {allCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="subcategory">Subcategory</label>
                    <select
                        id="subcategory"
                        value={selectedSubcategory}
                    // onChange={onSubcategoryChange}
                    >
                        <option value="">Select Subcategory</option>
                        {allSubcategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                    <div style={{display:'flex',justifyContent:'space-between', marginTop:'25px'}}>
                        <button className="reset-button" onClick={handleResetFilter}>
                            Reset
                        </button>
                        <button className="apply-button" onClick={handleApplyFilter}>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
            {/* : */}
            {/* <div style={{backgroundColor: 'red'}}></div>} */}
        </>
    );
};

export default FilterModal;
