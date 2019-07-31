/**
 * Resources api controller
 */
import axios from 'axios';
import ErrorHandler from '../helpers/ErrorHandler';

/**
 * Get the list of states
 * @return {Promise<Array>} response - Promise with states
 */
const handleGetStates = () => {
  let response = new Promise((resolve, reject) => {
    axios.get(`/api/v2/admin/resources/states`).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(ErrorHandler.handle(error));
    });
  });
  return response;
}

/**
 * Get the list of states
 * @return {Promise<Array>} response - Promise with states
 */
const handleGetCenters = () => {
  let response = new Promise((resolve, reject) => {
    axios.get(`/api/v2/admin/resources/centers`).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(ErrorHandler.handle(error));
    });
  });
  return response;
}

module.exports = {
  handleGetStates,
  handleGetCenters
};