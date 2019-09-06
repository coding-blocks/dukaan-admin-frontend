import React from 'react';
import Head from "../components/head";
import Layout from "../components/layout";
import Loader from "../components/loader";
import config from "../config";
import { axios } from '../DukaanAPI';
import Cookies from 'js-cookie'
import ErrorHandler from "../helpers/ErrorHandler";
import jwt from "jsonwebtoken";

class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      errorMessage: ''
    }
  }

  componentDidMount() {
    let authCode = window.location.search.split('=')[1];
    axios.post(config.dukaan_backend.token_url, { code: authCode }).then((response) => {
      if (response.data && response.data.jwtToken) {
        ErrorHandler.setUserContext(jwt.decode(response.data.jwtToken))
        Cookies.set('dukaan-token', response.data.jwtToken, { expires: 7, path: '/' ,  domain: '.codingblocks.xyz'});
        window.location = '/';
      } else {
        this.setState({
          loading: false,
          errorMessage: `Server did not return JWT token! ${ErrorHandler.handle(error)}`
        });
      }
    }).catch((error) => {
      this.setState({
        loading: false,
        errorMessage: ErrorHandler.handle(error)
      });
    });
  }

  render() {
    return (
      <div>
        <Head title={"Authenticating... | Dukaan | Coding Blocks"} />
        <Layout />
        {this.state.loading &&
          <Loader />
        }
        {!this.state.loading && this.state.errorMessage.length > 0 &&
          <div className={"mt-5"}>
            <h3 align={"center"}>
              {this.state.errorMessage}<br />
              Please try logging in here by <a href="/login" className={"red"}>clicking here</a>, or contact
              the dev team for assistance.
            </h3>
          </div>
        }
      </div>
    )
  }

}

export default Auth;