/**
 * Controller for users
 */

import { axios } from "../DukaanAPI";
import ErrorHandler from "../helpers/ErrorHandler";
const querystring = require("querystring");

/**
 * Get user by email
 * @param {string} email - The email
 * @return {Promise<Array>} - The results
 */
const handleGetUserByEmail = email => {
  const response = new Promise((resolve, reject) => {
    axios
      .get(`/api/v2/admin/users?email=${encodeURIComponent(email)}`)
      .then(r => {
        resolve(r);
      })
      .catch(error => {
        if (error.response.status === 404) {
          reject("User not found");
        } else {
          reject(ErrorHandler.handle(error));
        }
      });
  });
  return response;
};

const handleGetUserById = id => {
  const response = new Promise((resolve, reject) => {
    axios
      .get(`/api/v2/admin/users/` + id)
      .then(r => {
        resolve(r);
      })
      .catch(error => {
        if (error.response.status == 404) {
          reject("User not found");
        } else {
          reject(ErrorHandler.handle(error));
        }
      });
  });
  return response;
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
  handleGetUserByEmail,
  handleAddUser,
  handleGetUserById,
  getUsernameAvailability,
  getUserByFromOneAuthByOneAuthId,
  updateUserDetails
};
