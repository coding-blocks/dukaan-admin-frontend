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

const searchCoupons = (queryParams, pagination) => {
    let query = querystring.stringify(queryParams);
    return  axios.get(`/api/v2/admin/couponsv2?page=` + pagination.currentPage + `&limit=` + pagination.rowsPerPage + `&` +query)
}

const handleEditCoupon = (queryParams, couponId) => {

    if (queryParams.mode === 'flat') {
        delete queryParams.percentage
        delete queryParams.max_discount
    }  else {
        delete queryParams.amount
    }
    
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
    return axios.delete(`/api/v2/admin/couponsv2/` + id)
}

const getCoupon = (id) => {
    return axios.get(`/api/v2/admin/couponsv2/` + id)
}

const getProductsWithMrpLessThanDiscount = (data) => {
    return axios.get(`/api/v2/admin/couponsv2/productsWithMrpLessThanDiscount`, {params: data})
}

const getCodeAvailability = (code) => {
    return axios.get(`/api/v2/admin/couponsv2/codeAvailability`, {
        params: {
            code: encodeURIComponent(code)
        }
    })
}

const getAppliedCouponUsersList = (data) => {
    return axios.get(`/api/v2/admin/couponsv2/appliedCouponUsersList`, {params: data} )
}

const fetchBulkSubCategories = (data) => {
    return axios.get(`/api/v2/admin/couponsv2/bulkSubCategories`, {params: data})
}

const handleAddBulkCoupons = (data) => {
    return axios.post(`/api/v2/admin/couponsv2/bulk`, data)
}

export {
    fetchAddCouponData,
    generateRandomCouponCode,
    fetchSubCategories,
    fetchSubCategoryRules,
    handleAddCoupon,
    handleEditCoupon,
    handleDeleteCoupon,
    fetchEditCouponData,
    fetchAllCouponCategories,
    searchCoupons,
    getCoupon,
    getProductsWithMrpLessThanDiscount,
    getCodeAvailability,
    getAppliedCouponUsersList,
    fetchBulkSubCategories,
    handleAddBulkCoupons
}
