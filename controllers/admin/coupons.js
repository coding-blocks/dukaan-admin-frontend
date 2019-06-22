import axios from 'axios';

/**
 * Fetches the coupons from the server
 * @param {object} queryParams - Search filter params to be sent
 * @return {Promise<Array>} response - Promise with the response
 */
const handleGetCoupons = (queryParams) => {
  let mockData = []
  for (let i = 0; i < 100; i++) {
    let mockCoupon = {
      id: i,
      code: "ANANAY",
      category: 'referral',
      cashback: Math.floor(Math.random() * 10000),
      mode: 'Flat',
      amount: Math.floor(Math.random() * 10000),
      percentage: Math.floor(Math.random() * 100),
      left: Math.floor(Math.random() * 500),
      products: 'CB',
      active: 'true'
    };
    mockData.push(mockCoupon);
  }

  let response = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1000);
  });

  return response;
};

/**
 * Saves the coupon edits on the server
 * @param {object} queryParams – Save data to be sent
 * @return {Promise<string>} response – Returns if the request was
 *  successful or not
 */
const handleSaveCoupon = (queryParams) => {
  let response = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
  return response;
};

/**
 * Get coupon information from the server based on coupon ID
 * @param {int} id 
 * @return {Promise<object>} response – Coupon info object
 */
const handleGetCouponFromID = (id) => {

  let couponInfo = {
    id,
    code: "ANANAY",
    category: 'referral',
    cashback: Math.floor(Math.random() * 10000),
    mode: 'Flat',
    amount: Math.floor(Math.random() * 10000),
    percentage: Math.floor(Math.random() * 100),
    left: Math.floor(Math.random() * 500),
    products: 'CB',
    active: 'true'
  }  

  let response = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(couponInfo);
    }, 1000);
  });

  return response;

}

module.exports = {
  handleGetCoupons,
  handleSaveCoupon,
  handleGetCouponFromID
};