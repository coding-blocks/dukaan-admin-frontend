/**
 * Controller for users
 */

import axios from 'axios';
import "../DukaanAPI";
import ErrorHandler from "../helpers/ErrorHandler";
const querystring = require("querystring");

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

/**
 * Add the user
 * @param {object} data – Object with user data
 * @return {Promise<object>} response
 */
const handleAddUser = (data) => {
  const formBody = querystring.stringify(data);
  const response = new Promise((resolve, reject) => {
    axios.post(`/api/v2/admin/users`, formBody).then((r) => {
      resolve(r);
    }).catch((error) => {
      reject(ErrorHandler.handle(error));
    });
  });
  return response;
};

module.exports = {
  handleGetUserByEmail,
  handleAddUser
}