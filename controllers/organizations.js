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


module.exports = {
    getAllOrganizations
};
