import React from 'react';
import Head from "../components/head";
import Layout from "../components/layout";
import Loader from "../components/loader";
import config from "../config";
import axios from 'axios';
import cookies from 'js-cookies';

class Auth extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let authCode = window.location.search.split('=')[1];
    axios.post(config.backend.token_url, {code: authCode}).then((response) => {
      if (response.data && response.data.jwtToken) {
        cookies.setItem('dukaan-token', response.data.jwtToken);
        window.location = '/';
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <Head title={"Authenticating... | Dukaan | Coding Blocks"} />
        <Layout />
        <Loader />
      </div>
    )
  }

}

export default Auth;