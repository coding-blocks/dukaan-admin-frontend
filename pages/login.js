import React from 'react';
import Head from "../components/head";
import Layout from "../components/layout";
import Loader from "../components/loader";
import config from "../config";

class Login extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.location = config.oneauth.login_url;
  }

  render() {
    return (
      <div>
        <Head title={"Logging in | Dukaan | Coding Blocks"} />
        <Layout />
        <Loader />
      </div>
    )
  }

}

export default Login;