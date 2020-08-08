import {axios} from "../DukaanAPI";
import ErrorHandler from '../helpers/ErrorHandler';
import organizationController from './organizations';
import resourcesController from "./resources";

const querystring = require('querystring');

const handleAddBuyLink = (data) => {
    return axios.post(`/api/v2/admin/buy_links`, data)
}

const searchBuyLinks = (queryParams, pagination) => {
    let query = querystring.stringify(queryParams);
    return  axios.get(`/api/v2/admin/buy_links?page=` + pagination.currentPage + `&limit=` + pagination.rowsPerPage + `&` +query)
}

const getFilterFormData = () => {
	return Promise.all([
        organizationController.getAllOrganizations(),
        resourcesController.getStates()
        ])
}

export {
    handleAddBuyLink,
    searchBuyLinks,
    getFilterFormData
}
