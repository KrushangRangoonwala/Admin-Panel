export async function getAllSize(setAllSize) {
    try {
        const response = await api.get("/size");
        console.log("Sizes:", response.data);
        setAllSize(response.data);
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleAddSize(values) {
    try {
        const response = await api.post("/size", values);
        console.log("Size added:", response.data);
        getAllSize();
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getSizeById(id) {
    try {
        const response = await api.get(`/size/id/${id}`);
        // console.log('response.data.data', response.data.data);
        return response.data.data;
    } catch (error) {
        console.log('error', error);
    }
}

export async function handleDeleteSize(id) {
    try {
        const response = await api.delete(`/size/id/${id}`);
        console.log('Size deleted:', response.data);
        getAllSize();
    } catch (error) {
        console.error("Error:", error);
    }
}
