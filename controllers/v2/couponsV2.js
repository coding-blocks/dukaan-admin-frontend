import {axios} from "../../DukaanAPI";
import organizationController from '../organizations';

const fetchAllCouponCategories = () => {
	return axios.get(`/api/v2/admin/couponsv2/categories`)
}

const fetchOrganizations = () => {
	return organizationController.getAllOrganizations()
}

const fetchAddCouponData = () => {
    return Promise.all([
        fetchAllCouponCategories(),
        fetchOrganizations()
    ])
}

const generateRandomCouponCode = () => {
	let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const fetchSubCategories = (data) => {
	return axios.get(`/api/v2/admin/couponsv2/subCategories`, {params: data})
}

const fetchSubCategoryRules = (data) => {
	return axios.get(`/api/v2/admin/couponsv2/subCategory/rules`, {params: data})
}


export {
    fetchAddCouponData,
    generateRandomCouponCode,
    fetchSubCategories,
    fetchSubCategoryRules
}
