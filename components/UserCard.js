const UserCard = ({userInfo, showOrders, handleNewPayment}) => {
  console.log("UserInfo", userInfo);
  if (userInfo) {
    return (
          <div className="border-card br-20 bg-light-grey mb-5">
            <h5>User Details</h5>
            <div
              style={{
                alignItems: "center"
              }}
            >
              <p className="red">
                Username : {userInfo.username}
              </p>

              <p>
                Name : {userInfo.firstname}{" "}
                {userInfo.lastname}
              </p>

              <p>Email : {userInfo.email}</p>

              <p>Mobile : {userInfo.mobile_number}</p>

              <p>
                Wallet Amount : ₹ {userInfo.wallet_amount / 100}
              </p>

              <p>OneauthId: {userInfo.oneauth_id}</p>

              <div className={"mt-4"}>
                <button
                  className={"button-solid"}
                  onClick={() => {
                    showOrders(userInfo)
                  }}
                >
                  Show Orders
                </button>
                <button
                  className={"button-solid ml-4"}
                  onClick={() => {
                    handleNewPayment(userInfo)
                  }}
                >
                  Make New Payment
                </button>
              </div>
            </div>
        {/* {!this.state.newpayment ? (
          <div className="col-md-8 col-12">
            <div className="border-card br-20 bg-light-grey mb-5 w-100">
              <div className="tab-nav-underline mb-5">
                <div
                  className={this.state.activeTab ? "tab active" : "tab"}
                  onClick={this.toggleActiveTab}
                >
                  Active Orders
                </div>
                <div
                  className={this.state.completeTab ? "tab active" : "tab"}
                  onClick={this.toggleCompleteTab}
                >
                  Completed Orders
                </div>

                <div
                  className={this.state.refundedTab ? "tab active" : "tab"}
                  onClick={this.toggleRefundTab}
                >
                  Refunded Orders
                </div>
              </div>
              {orders}
            </div>
          </div>
        ) : (
          <NewPayment userid={userInfo.oneauth_id} />
        )} */}
      </div>
    );
  }
};

export default UserCard;
