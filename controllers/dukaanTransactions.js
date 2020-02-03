import {axios} from "../DukaanAPI";

/**
 * Dukaan Transactions API controller
 */

const getTransactionByRazorpayPaymentId = (razorpayPaymentId) => {
    return axios.get(`/api/v2/admin/transactions?razorpayPaymentId=${razorpayPaymentId}`)
}

const capturePaymentManual = (capturePayload) => {
    return axios.post('/api/v2/admin/transactions/capture', capturePayload)
}

module.exports = {
    getTransactionByRazorpayPaymentId,
    capturePaymentManual
};
