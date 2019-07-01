import axios from 'axios';
import "../config";
const querystring = require('querystring');

/**
 * Fetches the products from the server
 * @param {object} queryParams - Search filter params to be sent
 * @return {Promise<Array>} response - Promise with the response
 */
const handleGetProducts = (queryParams, pageInfo) => {
  let query = querystring.stringify(queryParams);
  let response = new Promise((resolve, reject) => {
    axios.get(`/api/products?page=`+pageInfo.page+`&limit=`+pageInfo.limit+`&`+query).then((r) => {
      let data = {
        results: r.data.products,
        pagesInfo: r.data.pagesInfo
      }
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
  return response;
}

module.exports = {
  handleGetProducts
}