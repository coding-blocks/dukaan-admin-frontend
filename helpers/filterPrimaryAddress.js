export function filterPrimaryAddress(addresses) {
    if (!addresses) {
        return
    }
    const primaryAddressArray = addresses.filter((address) => {
        return address.primary === true
    })
    return primaryAddressArray[0]

}

