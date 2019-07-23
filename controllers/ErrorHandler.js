/**
 * This method returns the ids of the fields 
 * that have an issue
 * @param {object} error – Axios Error Object
 * @return {string} errorString – The error message to display
 */
const getFields = (error) => {
  
}

/**
 * Handler for Axios Errors
 * @param {object} error – Axios Error object
 * @return {string} errorString – The error message to display
 */
const handle = (error) => {
  try {
    // TODO: Add Sentry to error handler
    // Check if the error is in the response or request
    if (error.response) {
      // If the error is in the server's response
      if (error.response.status == 401) {
        // If the status is 401, we are unauthorized
        return "You are not logged in! Please log into Dukaan again by <a href='/login'>clicking here</a>.";
      } else if (error.response.status == 400) {
        if (typeof error.response.data.data == "object" && typeof error.response.data.data[0].message == "string") {
          let errorString = ``;
          for (let i = 0; i < error.response.data.data.length; i++) {
            errorString = errorString + error.response.data.data[i].message + '\n';
          }
          return errorString;
        } else {
          throw "Invalid error response syntax";
        }
      } else if (error.response.status >= 500) {
        // If it's a server issue
        return `Dukaan server issue! Please follow up with the dev team at Coding Blocks.`;
      }
    } else if (error.request) {
      // If there was an error sending the HTTP request
      return `Unable to connect to Dukaan's servers! Please check your internet connection or contact the dev team for assistance.`;
    }
  } catch (error) {
    return `An unknown error occurred. Please contact Coding Blocks dev team!`;
  }
}

export default {
  handle
}