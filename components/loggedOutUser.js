import React from 'react';
import Head from "./head";
import Layout from "./layout";
import CheckLogin from './CheckLogin';

class LoggedOutUser extends React.Component {
  render() {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    
    if (isAdminRoute) {
      return (
        <div>
          <Head title={"Admin Login | Dukaan"} />
          <CheckLogin />
        </div>
      );
    }

      return (<div>
          <Head title={"Dukaan | Coding Blocks"} />
          <Layout />
          <div className={"not-logged-in"}>
            <h2>Welcome to Dukaan!</h2>
            <h3>
              The page you are trying to view requires you to be logged in.
            </h3>
            <h3>
              <a href="/login" className={"red"}>
                Click here to login
              </a>
            </h3>
          </div>
      </div>)
  }
}

export default LoggedOutUser;