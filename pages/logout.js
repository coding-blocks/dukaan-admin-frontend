import React from 'react';
import Head from '../components/head';
import Layout from '../components/layout';
import config from "../config";
import cookies from 'js-cookies';
import Cookies from 'js-cookie';
import Loader from '../components/loader';

class Logout extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Cookies.remove('dukaan-token');
    Cookies.remove('oneauth');
    window.location = config.domain;
  }
  
  render() {
    return (
      <div>
        <Head />
        <Layout title={"Logging out... | Dukaan | Coding Blocks"} />
        <Loader />
      </div>
    )
  }

}

export default Logout;