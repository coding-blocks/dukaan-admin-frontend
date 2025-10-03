import React from 'react';
import Head from '../components/head';
import Layout from '../components/layout';
import config from "../config";
import Cookies from 'js-cookie';
import Loader from '../components/loader';
import { handleLogout } from '../controllers/users';

class Logout extends React.Component {

    constructor(props) {
        super(props);
    }

  async componentDidMount() {
    try {
      await handleLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('vmx_auth', {
        path: '/',
        domain: config.dukaan_backend.cookie_domain
      });
      window.location = config.domain;
    }
}

    render() {
        return (
            <div>
                <Head/>
                <Layout title={"Logging out... | Dukaan | Coding Blocks"}/>
                <Loader/>
            </div>
        )
    }

}

export default Logout;
