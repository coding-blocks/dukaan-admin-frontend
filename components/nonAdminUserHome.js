import React from 'react';
import Head from "./head";
import Layout from "./layout";

class NonAdminUserHome extends React.Component {
  render() {
        return (<div>
          <Head title={"Dukaan | Coding Blocks"} />
            <Layout />
          <div className={"not-logged-in"}>
            <h2>Welcome to Dukaan!</h2>
            <h3>You need to be an admin to view this page.</h3>
          </div>
        </div>)
  }
}

export default NonAdminUserHome;
