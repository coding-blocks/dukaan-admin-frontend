/**
 * Controller for Refund
 */
import axios from "axios";
import "../config";
import ErrorHandler from "../helpers/ErrorHandler";
const querystring = require("querystring");

/**
 * Create refund method
 * @param {object} data
 * @return {Promise<object>}
 */
const handleCreateRefund = data => {
  const formBody = querystring.stringify(data);
  const response = new Promise((resolve, reject) => {
    axios
      .post(`/api/v2/admin/refunds`, formBody)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(ErrorHandler.handle(error));
      });
  });
  return response;
};

/**
 * Get the refunds from txn id
 * @param {string} txn_id
 * @return {Promise<Object>} response
 */
const handleGetRefundFromTxnId = txn_id => {
  let response = new Promise((resolve, reject) => {
    axios
      .get(`/api/v2/admin/refunds?txn_id=` + txn_id)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(ErrorHandler.handle(error));
      });
  });
  return response;
};

/**
 * Get Refunds from txn ID
 */

module.exports = {
  handleCreateRefund,
  handleGetRefundFromTxnId
};
