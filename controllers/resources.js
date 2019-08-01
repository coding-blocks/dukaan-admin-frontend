/**
 * Resources api controller
 */
import axios from 'axios';
import "../config";
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
 * Get the list of colleges
 * @return {Promise<Array>} response - Promise with countries
 */
const handleGetColleges = () => {
  let response = new Promise((resolve, reject) => {
    axios.get(`/api/v2/admin/resources/demographics`).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(ErrorHandler.handle(error));
    });
  });
  return response;
};

/**
 * Get the list of countries
 * @return {Promise<Array>} response - Promise with countries
 */
const handleGetCountries = () => {
  let response = new Promise((resolve, reject) => {
    axios.get(`/api/v2/admin/resources/countries`).then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(ErrorHandler.handle(error));
    });
  });
  return response;
};

/**
 * Get the list of centers
 * @return {Promise<Array>} response - Promise with centers
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
  handleGetColleges,
  handleGetCountries,
  handleGetCenters
};