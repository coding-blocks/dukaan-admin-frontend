/**
 * Controller for users
 */

import { axios } from "../DukaanAPI";
import ErrorHandler from "../helpers/ErrorHandler";
const querystring = require("querystring");

/**
 * Get user by email or phone
 * @param {string} option - The email or phone option
 * @param {string} value - The input value for email or phone
 * @return {Promise<Array>} - The results
 */
const handleGetUserByEmailOrPhone = (option, value) => {
  return axios.get(`/api/v2/admin/users?${option}=${encodeURIComponent(value)}`)
};

const handleGetUserById = id => {
  return axios.get(`/api/v2/admin/users/` + id)
};

const getUserByFromOneAuthByOneAuthId = (oneauthId) => {
  return axios.get(`/api/v2/admin/users/oneauth/` + oneauthId)
}

/**
 * Add the user
 * @param {object} data – Object with user data
 * @return {Promise<object>} response
 */
const handleAddUser = data => {
  const formBody = querystring.stringify(data);
  const response = new Promise((resolve, reject) => {
    axios
      .post(`/api/v2/admin/users`, formBody)
      .then(r => {
        resolve(r);
      })
      .catch(error => {
        reject(ErrorHandler.handle(error));
      });
  });
  return response;
};


const getUsernameAvailability = username => {
    return axios.get(`/api/v2/admin/signup_check/username`, {
      params: {
        username: encodeURIComponent(username)
      },
    })

};

const updateUserDetails = (values) => {
    return axios
        .patch(`/api/v2/admin/users`, values)

};

module.exports = {
  handleGetUserByEmailOrPhone,
  handleAddUser,
  handleGetUserById,
  getUsernameAvailability,
  getUserByFromOneAuthByOneAuthId,
  updateUserDetails
};
