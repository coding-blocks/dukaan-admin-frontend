import Link from "next/link";

const SingleUserDetail = ({ userInfo, showOrders, handleNewPayment }) => {
  if (userInfo) {
    return (
      <div className="border-card br-20 bg-light-grey mb-5">
        <h5>User Details</h5>
        <div
          style={{
            alignItems: "center"
          }}
        >
          <p className="red">Username : {userInfo.username}</p>
          <p>
            Name : {userInfo.firstname} {userInfo.lastname}
          </p>
          <p>Email : {userInfo.email}</p>
          <p>Mobile : {userInfo.mobile_number}</p>
          <p>Credits Available : ₹ {userInfo.wallet_amount / 100}</p>
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
      </div>
    );
  }
};

export default SingleUserDetail;
