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
  // TODO: Add Sentry to error handler
  // Check if the error is in the response or request
  if (error.response) {
    // If the error is in the server's response
    if (error.response.status == 401) {
      // If the status is 401, we are unauthorized
      return "You are not logged in! Please log into Dukaan again by <a href='/login'>clicking here</a>.";
    } else if (error.response.status == 400) {
      // Type check the "data.err" object in the response
      if (typeof error.response.data.data.err == "string") {
        return ("Unknown validation error. Please check the data in fields.");
      } else if (typeof error.response.data.data.err.errors == "object") {
        // Grab all the errors and concat them into a string
        const errorsArray = error.response.data.data.err.errors;
        let errorString = ``;
        if (errorsArray.length == 1) {
          // If there is only one error
          return (`An error occurred: ${errorsArray[0].message}`);
        } else if (errorsArray.length > 1) {
          // If there are multiple errors
          let errorString = ``;
          for (let i = 0; i < errorsArray.length; i++) {
            errorString += `${errorsArray[i].message}`;
          }
          return (`The following errors occurred: ${errorString}`);
        } else {
          // If it's an empty array or something we don't know
          return (`An unknown error occurred. Please get in touch with the dev team to resolve this.`);
        }
      } else {
        // If we don't know in what form the error is
        return "Unknown error, please contact dev team.";
      }
    } else if (error.response.status >= 500) {
      // If it's a server issue
      return `Dukaan server issue! Please follow up with the dev team at Coding Blocks.`;
    }
  } else if (error.request) {
    // If there was an error sending the HTTP request
    return `Unable to connect to Dukaan's servers! Please check your internet connection or contact the dev team for assistance.`;
  }
}

module.exports = {
  handle
}