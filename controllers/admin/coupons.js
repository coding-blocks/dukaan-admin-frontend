import axios from 'axios';

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

module.exports = {
  handleGetCoupons
};