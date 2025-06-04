import api from "../axiosConfig";

export async function getCategoryData(setCategories) {
    try {
        const response = await api.get("/category");
        console.log("Categories:", response.data);
        console.log('response.data.allCategory', response.data.allCategory)
        setCategories(response.data.allCategory);
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getDashboardData(setDashboardData) {
    try {
        const response = await api.get("/");
        // console.log("Dashboard Data:", response.data);
        const { categoryCount, subCategoryCount, productCount } = response.data;
        setDashboardData({ categoryCount, subCategoryCount, productCount });
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleDeleteCategory(id) {
    try {
        const response = await api.delete(`/category/id/${id}`);
        console.log("Response", response.data);
    } catch (error) {
        console.log('error', error)
    }
}

export async function getCategoryById() {
    try {
      const response = await api.get(`/category/id/${categoryId}`);
      // console.log('Category Data:', response.data);
      setCategoryData(response.data.data);
      catDescRef.current.innerHTML = response.data.data.desc;
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  }
