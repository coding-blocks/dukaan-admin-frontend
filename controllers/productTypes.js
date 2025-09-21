import {axios} from "../DukaanAPI";

export const getAllProductTypes = () => {
    return axios.get(`/api/v2/admin/product_types`)
}

export const getProductTypeById = (productTypeId) => {
    return axios.get(`/api/v2/admin/product_types/${productTypeId}`)
}
