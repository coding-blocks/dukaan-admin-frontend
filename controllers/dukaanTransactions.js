import {axios} from "../DukaanAPI";

/**
 * Dukaan Transactions API controller
 */

const getTransactionByRazorpayPaymentId = (razorpayPaymentId) => {
    return axios.get(`/api/v2/admin/transactions?razorpayPaymentId=${razorpayPaymentId}`)
}


module.exports = {
    getTransactionByRazorpayPaymentId
};
