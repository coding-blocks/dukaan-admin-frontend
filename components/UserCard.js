import Link from "next/link";
import { useRouter } from "next/router";

const UserCard = ({ userInfo, getUserById }) => {
  const router = useRouter();

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
          <p className="red">Username : {userInfo.username}</p>

          <p>
            Name : {userInfo.firstname} {userInfo.lastname}
          </p>

          <p>Email : {userInfo.email}</p>

          <p>Mobile : {userInfo.mobile_number}</p>

          <p>Wallet Amount : ₹ {userInfo.wallet_amount / 100}</p>

          <div className={"mt-4"}>
            <Link href={`/admin/user?id=${userInfo.id}`}>
              <button
                className={"button-solid"}
                onClick={() => {
                  getUserById(userInfo.id);
                }}
              >
                Select User
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default UserCard;
