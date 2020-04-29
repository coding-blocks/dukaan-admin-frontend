import {axios} from "../../DukaanAPI";
import ErrorHandler from "../../helpers/ErrorHandler";
import organizationController from '../organizations';

const fetchAllCouponCategories = () => {
	let response = new Promise((resolve, reject) => {
	    axios.get(`/api/v2/admin/couponsv2/categories`).then((response) => {
	        resolve(response)
	      }).catch((error) => {
	      reject(ErrorHandler.handle(error));
	      })
	    })
  	return response
}

const fetchOrganizations = () => {
	let response = new Promise((resolve, reject) => {
	    organizationController.getAllOrganizations().then((response) => {
	        resolve(response)
	    }).catch((error) => {
	      reject(ErrorHandler.handle(error));
	    })
	})
	return response
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
	let response = new Promise((resolve, reject) => {
   		axios.get(`/api/v2/admin/couponsv2/subCategories`, {params: data}).then((response) => {
   			resolve(response)
   		}).catch((error) => {
	      reject(ErrorHandler.handle(error));
   		})
   	})
    return response
}

const fetchSubCategoryRules = (data) => {
	let response = new Promise((resolve, reject) => {
   		axios.get(`/api/v2/admin/couponsv2/subCategory/rules`, {params: data}).then((response) => {
   			resolve(response)
   		}).catch((error) => {
	      reject(ErrorHandler.handle(error));
   		})
   	})
    return response
}


export {
    fetchAddCouponData,
    generateRandomCouponCode,
    fetchSubCategories,
    fetchSubCategoryRules
}
