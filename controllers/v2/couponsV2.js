const fetchAllCouponCategories = () => {
    return Promise.resolve()
}

const fetchAddCouponData = () => {
    return Promise.all([
        fetchAllCouponCategories()
    ])
}

export {
    fetchAddCouponData
}
