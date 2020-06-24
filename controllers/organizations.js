import "../config";
import {axios} from "../DukaanAPI"
import ErrorHandler from '../helpers/ErrorHandler';

/**
 * Get the list of organizations
 * @return {Promise<Array>} response - Promise with organizations
 */
const getAllOrganizations = () => {
    return axios.get(`/api/v2/admin/organizations`)
};

const getOrganizationCenters = (id) => {
	return axios.get(`/api/v2/admin/organizations/${id}/centers`)
}


module.exports = {
    getAllOrganizations,
    getOrganizationCenters
};
