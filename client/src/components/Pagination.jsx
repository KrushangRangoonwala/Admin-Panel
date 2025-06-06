import React, { useState, useEffect, memo } from "react";
import "./Pagination.css";

const Pagination = ({
    totalPages,
    pageSizeOptions = [5, 10, 20, 50],
    setPageNo,
    setPageSize,
    pageNo,
    pageSize,
    getProducts }) => {


    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setPageNo(1); // Reset to first page when page size changes
        // getProducts();  // don't use it here, bcs setState is async
    };

    const handleClick = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setPageNo(pageNum);
            // getProducts();
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let start = Math.max(pageNo - Math.floor(maxPagesToShow / 2), 1);
        let end = start + maxPagesToShow - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(end - maxPagesToShow + 1, 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        // <div className="pagination-container">
        //     <div className="page-size">
        //         <label>Page Size:</label>
        //         <select value={pageSize} onChange={handlePageSizeChange}>
        //             {pageSizeOptions.map((size) => (
        //                 <option key={size} value={size}>
        //                     {size}
        //                 </option>
        //             ))}
        //         </select>
        //     </div>

        //     <div className="pagination">
        //         <button
        //             className="nav-btn"
        //             onClick={() => handleClick(pageNo - 1)}
        //             disabled={pageNo === 1}
        //         >
        //             &laquo; Prev
        //         </button>

        //         {getPageNumbers().map((pageNum) => (
        //             <button
        //                 key={pageNum}
        //                 className={`page-btn ${pageNo === pageNum ? "active" : ""}`}
        //                 onClick={() => handleClick(pageNum)}
        //             >
        //                 {pageNum}
        //             </button>
        //         ))}

        //         <button
        //             className="page-link page"
        //             onClick={() => handleClick(pageNo + 1)}
        //             disabled={pageNo === totalPages}
        //         >
        //             Next &raquo;
        //         </button>
        //     </div>
        // </div>
        <div className='paginate'>
            <div className="">
                <label className='page-size page-link' style={{ border: 'none' }}>Page Size:</label>
                <select value={pageSize} onChange={handlePageSizeChange} className='page-size page-link'>
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="page-container">
                <button
                    disabled={pageNo === 1}
                    className={`page-link ${pageNo === 1 && 'disabled'}`}
                    onClick={() => handleClick(pageNo - 1)}
                > &laquo; Prev</button>

                {getPageNumbers().map((pageNum) => (
                    <span
                        key={pageNum}
                        onClick={() => handleClick(pageNum)}
                        className={`page-number ${pageNo === pageNum ? "active" : ""}`}
                    >{pageNum}</span>
                ))}

                <button
                    className={`page-link ${pageNo === totalPages && 'disabled'}`}
                    disabled={pageNo === totalPages}
                    onClick={() => handleClick(pageNo + 1)}
                >
                    Next &raquo;
                </button>
            </div>
        </div>
    );
};

export default memo(Pagination);
