/**
 * Controller for Refund
 */
import axios from "axios";
import "../config";
import ErrorHandler from "../helpers/ErrorHandler";

/**
 * Create refund method
 * @param {object} formBody 
 * @return {Promise<object>}
 */
const handleCreateRefund = (formBody) => {
  let response = new Promise((resolve, reject) => {
    axios.post(`/api/v2/admin/refunds`, formBody).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(ErrorHandler.handle(error));
    });
  });
  return response;
}

/**
 * Get Refunds from txn ID
 */

module.exports = {
  handleCreateRefund
};