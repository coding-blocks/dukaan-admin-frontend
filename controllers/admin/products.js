import axios from 'axios';
import "../config";
import ErrorHandler from "../ErrorHandler";
const querystring = require('querystring');

/**
 * Fetches the products from the server
 * @param {object} queryParams - Search filter params to be sent
 * @return {Promise<Array>} response - Promise with the response
 */
const handleGetProducts = (queryParams, pageInfo) => {
  let query = querystring.stringify(queryParams);
  let response = new Promise((resolve, reject) => {
    axios.get(`/api/v2/admin/products?page=`+pageInfo.page+`&limit=`+pageInfo.limit+`&`+query).then((r) => {
      let data = {
        results: r.data.products,
        pagesInfo: r.data.pagesInfo
      }
      resolve(data);
    }).catch((error) => {
      reject(ErrorHandler.handle(error));
    });
  });
  return response;
}

/**
 * Saves the product edits on the server
 * @param {object} queryParams – Save data to be sent
 * @return {Promise<string>} response – Returns if the request was
 *  successful or not
 */
const handleEditProduct = (queryParams) => {
  const id = queryParams.id;
  delete queryParams.id;
  delete queryParams.created_at;
  delete queryParams.updated_at;
  delete queryParams.deleted_at;
  delete queryParams.tax_id;
  delete queryParams.updated_by;
  delete queryParams.owner_user_id;
  delete queryParams.extension_of;
  delete queryParams.duration;
  delete queryParams.product_extensions;
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] == null) {
      queryParams[key] = "";
    }
    if (typeof(queryParams[key]) == 'number' || typeof(queryParams[key]) == 'boolean') {
      queryParams[key] = queryParams[key].toString();
    }
    if (typeof(queryParams[key]) == 'array') {
      queryParams[key] = queryParams[key].map((p) => {
        return p.toString();
      });
    }
  });

  let response = new Promise((resolve, reject) => {
    axios.patch(`/api/v2/admin/products/`+id, queryParams).then((r) => {
      queryParams.id = id;
      resolve(r);
    }).catch((error) => {
      queryParams.id = id;
      console.log(error);
      console.log(error.response.data);
      reject(ErrorHandler.handle(error));
    });
  });

  return response;
};

/**
 * Adds the product to the server
 * @param {object} queryParams – Save data to be sent
 * @return {Promise<string>} response – Returns if the request was
 *  successful or not
 */
const handleAddProduct = (queryParams) => {
  console.log(queryParams);
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] == null) {
      queryParams[key] = "";
    }
    if (typeof(queryParams[key]) == 'number' || typeof(queryParams[key]) == 'boolean') {
      queryParams[key] = queryParams[key].toString();
    }
    if (typeof(queryParams[key]) == 'array') {
      queryParams[key] = queryParams[key].map((p) => {
        return p.toString();
      });
    }
  });
  let response = new Promise((resolve, reject) => {
    axios.post(`/api/products`, queryParams).then((r) => {
      resolve(r);
    }).catch((error) => {
      reject(ErrorHandler.handle(error));
    });
  });
  return response;
}


module.exports = {
  handleGetProducts,
  handleAddProduct,
  handleEditProduct
}