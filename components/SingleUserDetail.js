import Link from "next/link";
import React from "react";

const SingleUserDetail = ({userInfo, showOrders, handleNewPayment, primaryAddress}) => {
    if (userInfo) {
        return (
            <div className="border-card br-20 bg-light-grey mb-5">
                <div className={"row"}>
                    <div>
                        <h5>User Details</h5>
                    </div>

                    <div className={"ml-4"}>
                        <Link href={`/admin/users/edit?oneauthId=${userInfo.oneauth_id}`}>
                            <button className={"button-solid"}>
                                Edit Details
                            </button>
                        </Link>
                    </div>

                    <div className={"ml-4"}>
                        <Link href={`/admin/users?oneauthId=${userInfo.oneauth_id}`}>
                            <button className={"button-solid"}>
                                View Details
                            </button>
                        </Link>
                    </div>

                </div>
                <div
                    style={{
                        alignItems: "center"
                    }}>
                    <p className="red">Username : {userInfo.username}</p>
                    <p>
                        Name : {userInfo.firstname} {userInfo.lastname}
                    </p>
                    <p>Email : {userInfo.email}</p>
                    <p>Mobile : {userInfo.mobile_number}</p>
                    <p>Credits Available : ₹ {userInfo.wallet_amount / 100}</p>
                    {primaryAddress ?
                        <div>

                            <p>Primary
                                Address: {`${primaryAddress.street_address},
                             ${primaryAddress.landmark}, ${primaryAddress.city}`}
                            </p>
                            <div className={"mt-4"}>
                                <Link href={`/admin/orders?id=${userInfo.id}`}>
                                    <button
                                        className={"button-solid"}
                                        onClick={() => {
                                            showOrders(userInfo);
                                        }}
                                    >
                                        Show Orders
                                    </button>
                                </Link>


                                <button
                                    className={"button-solid ml-4"}
                                    onClick={() => {
                                        handleNewPayment(userInfo);
                                    }}
                                >
                                    Make New Payment
                                </button>
                            </div>

                        </div>
                        :
                        <div>User does not have a primary address. Click Edit Details to add.</div>
                    }

                </div>
            </div>
        );
    }
};

export default SingleUserDetail;
