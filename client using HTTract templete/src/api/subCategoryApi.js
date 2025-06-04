import api from "../axiosConfig";

export async function getSubCategoryData(setSubcategories) {
    try {
        const response = await api.get(
            `/subCategory/subCategoryByCategory/${expandedCategoryId}`
        );
        console.log("Subcategories:", response.data);
        setSubcategories(response.data.data);
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getSubCatByCat(categoryId) {
    try {
        const response = await api.get(`/subCategory/subCategoryByCategory/${categoryId}`);
        console.log('Subcategories:', response.data);
        setSubCategory(response.data.data);
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getSubcatById(id) {
    try {
        const response = await api.get(`/subCategory/id/${id}`);
        // console.log('response.data.data', response.data.data);
        return response.data.data;
    } catch (error) {
        console.log('error', error);
    }
}

export async function handleDeleteSubCat(id) {
    try {
        await api.delete(`/subCategory/id/${id}`);
    } catch (error) {
        console.log('Error deleting subcategory:', error);
    }
}


export async function getSubCategoryById(setSubcategories) {
    try {
        const response = await api.get(`/subCategory/subCategoryByCategory/${categoryId}`);
        // console.log('Subcategories:', response.data);
        setSubcategories(response.data.data);
    } catch (error) {
        console.error('Error fetching subcategory data:', error);
    }
}