import {axios} from "../DukaanAPI";
import ErrorHandler from '../helpers/ErrorHandler';

const querystring = require('querystring');

const handleAddBuyLink = (data) => {
    return axios.post(`/api/v2/admin/buy_links`, data)
}

export {
    handleAddBuyLink
}
