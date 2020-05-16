import {axios} from "../../DukaanAPI";
import organizationController from '../organizations';
import ErrorHandler from '../../helpers/ErrorHandler';

const querystring = require('querystring');

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

const fetchSubCategoryId = (data) => {
    return axios.get(`/api/v2/admin/couponsv2/subCategoryId`, {params: data})
}

const fetchCouponUsers = (data) => {
    return axios.get(`/api/v2/admin/couponsv2/couponUsers`, {params: data})
}

const fetchCouponProducts = (data) => {
    return axios.get(`/api/v2/admin/couponsv2/couponProducts`, {params: data})
}

const fetchEditCouponData = (data) => {
    return fetchSubCategoryId({category: data.category, coupon_id: data.id})
        .then((response) => {
            const categoryRulesData = {
                category: data.category,
                id: response.data
            }
            return Promise.all([
                response,
                fetchAllCouponCategories(),
                fetchSubCategoryRules(categoryRulesData),
                fetchSubCategories({category: data.category}),
                fetchOrganizations(),
                fetchCouponProducts({id: data.id}),
                fetchCouponUsers({id: data.id})
            ])
        })
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

const handleAddCoupon = (data) => {
    const response = new Promise((resolve, reject) => {
        axios.post(`/api/v2/admin/couponsv2`, data).then(r => {
            resolve(r);
        }).catch(error => {
            reject(ErrorHandler.handle(error));
        });
    });
    return response;
}

const handleGetCoupons = (queryParams, pageInfo) => {
    let query = querystring.stringify(queryParams);
    let response = new Promise((resolve, reject) => {
        axios.get(`/api/v2/admin/couponsv2?page=` + pageInfo.page + `&limit=` + pageInfo.limit + `&` + query).then((r) => {
            let data = {
                results: r.data.coupons,
                products: r.data.products,
                pagesInfo: r.data.pagesInfo
            }
            resolve(data);
        }).catch((error) => {
            reject(ErrorHandler.handle(error));
        });
    });

    return response;

};

const searchCoupons = (queryParams, pagination) => {
    return axios.get(`/api/v2/admin/couponsv2?page=${pagination.currentPage}&limit=${pagination.rowsPerPage}`)
}

const handleEditCoupon = (queryParams, couponId) => {
    let response = new Promise((resolve, reject) => {
        axios.patch(`/api/v2/admin/couponsV2/` + couponId, queryParams).then((r) => {
            resolve(r);
        }).catch((error) => {
            reject(ErrorHandler.handle(error));
        });
    });
    return response;
};

const handleDeleteCoupon = (id) => {
    let response = new Promise((resolve, reject) => {
        axios.delete(`/api/v2/admin/couponsv2/` + id).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(ErrorHandler.handle(error));
        });
    });
    return response;
}


export {
    fetchAddCouponData,
    generateRandomCouponCode,
    fetchSubCategories,
    fetchSubCategoryRules,
    handleAddCoupon,
    handleGetCoupons,
    handleEditCoupon,
    handleDeleteCoupon,
    fetchEditCouponData,
    fetchAllCouponCategories,
    searchCoupons
}
