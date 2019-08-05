/**
* Controller for Product Categories
*/

import {axios} from "../DukaanAPI";
import ErrorHandler from "../helpers/ErrorHandler";

/**
 * Get all the product categories from the server.
 * @return {Promise<Array>} response
 */
const handleGetAllProductCategories = () => {
  let response = new Promise((resolve, reject) => {
    axios.get(`/api/productcategories`).then((r) => {
      resolve(r);
    }).catch((error) => {
      reject(ErrorHandler.handle(error));
    });
  });
  return response;
};

const handleGetProductCategoryById = (id) => {

};

const addProductCategory = (formBody) => {

}

module.exports = {
  handleGetAllProductCategories,
  handleGetProductCategoryById,
  addProductCategory
};