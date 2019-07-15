import axios from 'axios';
import "../config";
const querystring = require('querystring');

/**
 * Fetches the coupons from the server
 * @param {object} queryParams - Search filter params to be sent
 * @return {Promise<Array>} response - Promise with the response
 */
const handleGetCoupons = (queryParams, pageInfo) => {

  let query = querystring.stringify(queryParams);
  let response = new Promise((resolve, reject) => {
    axios.get(`/api/v2/admin/coupons?page=`+pageInfo.page+`&limit=`+pageInfo.limit+`&`+query).then((r) => {
      let data = {
        results: r.data.coupons,
        products: r.data.products,
        pagesInfo: r.data.pagesInfo
      }
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });

  return response;

};

/**
 * Saves the coupon edits on the server
 * @param {object} queryParams – Save data to be sent
 * @return {Promise<string>} response – Returns if the request was
 *  successful or not
 */
const handleEditCoupon = (queryParams) => {

  // Remove extra params from the request
  delete queryParams.created_at;
  delete queryParams.deleted_at;
  delete queryParams.updated_at;
  delete queryParams.valid_end;
  delete queryParams.valid_start;

  queryParams["categories"] = "1"

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
    axios.patch(`/api/v2/admin/coupons/`+queryParams.id, queryParams).then((r) => {
      resolve(r);
    }).catch((error) => {
      reject(error);
    });
  });
  return response;
};

/**
 * Get coupon information from the server based on coupon ID
 * @param {int} id 
 * @return {Promise<object>} response – Coupon info object
 */
const handleGetCouponFromID = (id) => {

  /** TODO */

  // // Mock coupon
  // let couponInfo = {
  //   id,
  //   code: "ANANAY",
  //   category: 'referral',
  //   cashback: Math.floor(Math.random() * 10000),
  //   mode: 'Flat',
  //   amount: Math.floor(Math.random() * 10000),
  //   left: Math.floor(Math.random() * 500),
  //   products: 'CB',
  //   active: 'true'
  // }
  // // Prepare mock response
  // let response = new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(couponInfo);
  //   }, 1000);
  // });
  // return response;
}

/**
 * Sends the coupon info to the database
 * @param {object} queryParams – New coupon params
 * @return {Promise<string>} response – Server response
 */
const handleAddCoupon = (queryParams) => {
  let response = new Promise((resolve, reject) => {
    axios.post(`/api/v2/admin/coupons`, queryParams).then((r) => {
      resolve(r);
    }).catch((error) => {
      reject(error);
    });
  });
  return response;
}

/**
 * Sends the coupon ID to delete
 * @param {int} id 
 */
const handleDeleteCoupon = (id) => {
  let response = new Promise((resolve, reject) => {
    axios.delete(`/api/v2/admin/coupons/`+id).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(error);
    });  
  });
  return response;
}

module.exports = {
  handleGetCoupons,
  handleEditCoupon,
  handleGetCouponFromID,
  handleAddCoupon,
  handleDeleteCoupon
};