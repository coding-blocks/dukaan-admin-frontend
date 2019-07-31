/**
 * Controller for users
 */

import axios from 'axios';
import "./config";
import ErrorHandler from "../helpers/ErrorHandler";

/**
 * Get user by email
 * @param {string} email - The email
 * @return {Promise<Array>} - The results
 */
const handleGetUserByEmail = (email) => {
  const response = new Promise((resolve, reject) => {
    axios.get(`/api/v2/admin/users?email=`+email).then((r) => {
      resolve(r);
    }).catch((error) => {
      if (error.response.status == 404) {
        reject("User not found");
      } else {
        reject(ErrorHandler.handle(error));
      }
    });
  });
  return response;
}

module.exports = {
  handleGetUserByEmail
}