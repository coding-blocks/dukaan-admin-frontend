import {axios} from "../DukaanAPI";
import ErrorHandler from "../helpers/ErrorHandler";
import Swal from "sweetalert2";
const querystring = require("querystring");

/**
 * Fetch the purchases of a user by user id
 * @param {int} userId - User ID
 * @return {Promise<Array>} response – Promise with the response
 */
const handleGetPurchases = userId => {
  let response = new Promise((resolve, reject) => {
    axios
      .get(`/api/v2/admin/purchases?user_id=${userId}`)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(ErrorHandler.handle(err))
      });
  });
  return response;
};

/**
 * Fetch the partial purchases of a user based
 *  on the user ID and cart ID
 * @param {int} userId - User ID
 * @param {int} cartId - Cart ID
 * @return {Promise<Array>} response – Promise with the response
 */
const handleGetPartialPurchases = (userId, cartId) => {
  let response = new Promise((resolve, reject) => {
    axios
      .get(`/api/v2/admin/purchases/partial?userId=${userId}&cartId=${cartId}`)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(ErrorHandler.handle(err));
      });
  });
  return response;
};

const cancelReceipt = (userId, cartId, txnId, comment) => {
    const formBody = {userId: userId, cartId:cartId, transactionId: txnId, comment: comment}
    let response = new Promise((resolve, reject) => {
        axios
            .post(`/api/v2/admin/purchases/cancel`, formBody)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(ErrorHandler.handle(err));
            });
    });
    return response;
};
/**
 * Add a new purchase
 * @param {object} data
 * @return {Promise<string>} response – Promise with the response
 */
const handleCreateNewPurchase = (data) => {
  let formBody = querystring.stringify(data);
  let response = new Promise((resolve, reject) => {
    axios.post(`/api/v2/admin/purchases`, formBody).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(ErrorHandler.handle(error))
    })
  });
  return response;
};

const handleCreatePartialPurchase = () => {};

module.exports = {
  handleGetPurchases,
  handleGetPartialPurchases,
  handleCreateNewPurchase,
  handleCreatePartialPurchase,
  cancelReceipt
};
