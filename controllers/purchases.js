import axios from 'axios';
import "./config";
import ErrorHandler from "../helpers/ErrorHandler";
const querystring = require('querystring');

/**
 * Fetch the purchases of a user by user id
 * @param {int} userId - User ID
 * @return {Promise<Array>} response – Promise with the response
 */
const handleGetPurchases = (userId) => {
  let response = new Promise((resolve, reject) => {
    axios.get(
      `/api/v2/admin/purchases?user_id=${userId}`
    ).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(ErrorHandler.handle(err));
    });
  });
  return response;
}

/**
 * Fetch the partial purchases of a user based
 *  on the user ID and cart ID
 * @param {int} userId - User ID
 * @param {int} cartId - Cart ID
 * @return {Promise<Array>} response – Promise with the response
 */
const handleGetPartialPurchases = (userId, cartId) => {
  let response = new Promise((resolve, reject) => {
    axios.get(
      `/api/v2/admin/purchases/partial?userId=${userId}&cartId=${cardId}`
    ).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(ErrorHandler.handle(err));
    });
  });
  return response;
}

const handleCreateNewPurchase = () => {

}

const handleCreatePartialPurchase = () => {
  
}

module.exports = {
  handleGetPurchases,
  handleGetPartialPurchases,
  handleCreateNewPurchase,
  handleCreatePartialPurchase
}