export async function handleDeleteProduct(id) {
    try {
        const response = await api.delete(`/product/id/${id}`);
        console.log(response);
        getProducts();
    } catch (error) {
        console.log("error in deleting product", error);
    }
}

export async function getProducts() {
    try {
        const response = await api.get(
            `/product?pageNo=${pageNo - 1}&pageSize=${pageSize}`
        );
        setRenderProducts(response.data.allProduct);
        setTotalProduct(response.data.totalProduct);
    } catch (error) {
        console.log("Error in get all product", error);
    }
}

// getProductById from productForm
// post put apis

export async function handleDownloadCsv() {
    console.log(
        "selectedProductOfAllPage.length",
        selectedProductOfAllPage.length
    );
    if (selectedProductOfAllPage.length > 0) {
        try {
            const response = await api.post(
                "/product/downloadCsv",
                { selectedIds: selectedProductOfAllPage },
                {
                    responseType: "Blob", //  important for file download
                }
            );

            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "selected_Products.csv"); // or .csv
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log("error in download CSV", error);
        }
    }
}

export async function getProductBySearchText() {
    if (!clearSearch) {
        setPageNo(1);
        setIsAllProdSelected(false);
        setSelectedProductOfAllPage([]);
    }
    async function callApi() {
        try {
            const searchedProducts = await api.get(`/product/searchBy/${searchText}?pageNo=${pageNo - 1}&pageSize=${pageSize}`);
            setRenderProducts(searchedProducts.data.data);
            setClearSearch(true);

            setTotalProduct(searchedProducts.data.totalProduct);
        } catch (error) {
            console.log("error in search api", error);
        }
    }
    setTimeout(() => callApi(), 300);  // setTiemOut for `setPageNo(1)` is async
}

export async function getProductBySubCategory(subId,setProductsList) {
    try {
        const response = await api.get(`/product/productBySubCategory/${subId}`);
        console.log('response.data', response.data);
        response.data.success && setProductsList(response.data.data);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}