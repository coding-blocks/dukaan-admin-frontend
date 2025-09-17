import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Head from "./head";
import Layout from "./layout";
import Loader from "./loader";
import axios from 'axios';
import config from '../config';

const CheckLogin = (props) => {
  const [authState, setAuthState] = useState({
    loggedIn: false,
    loading: true,
    admin: false,
    finance_manager: false
  });

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const dukaanToken = Cookies.get("vmc_auth");
    if (dukaanToken) {
      const userInfo = jwt.decode(dukaanToken);
      if (userInfo && userInfo.data.oneauth_id) {
        if (userInfo.data.role === "admin" || userInfo.data.role === "staff") {
          setAuthState({
            loggedIn: true,
            loading: false,
            admin: true,
            finance_manager: false
          });
        } else if (userInfo.data.role === 'finance_manager') {
          setAuthState({
            loggedIn: true,
            loading: false,
            admin: false,
            finance_manager: true
          });
        } else {
          setAuthState({
            loggedIn: true,
            loading: false,
            admin: false,
            finance_manager: false
          });
        }
      } else {
        setAuthState({
          loggedIn: false,
          loading: false,
          admin: false,
          finance_manager: false
        });
      }
    } else {
      setAuthState({
        loggedIn: false,
        loading: false,
        admin: false,
        finance_manager: false
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setError('');
    setMessage('');

    try {
      const endpoint = isLogin ? '/auth/admin/login' : '/auth/admin/signup';
      const response = await axios.post(
        `${config.dukaan_backend.domain}${endpoint}`,
        formData
      );

      if (response.data.success) {
        if (isLogin) {
          window.location.href = response.data.redirectTo;
        } else {
          setMessage(response.data.message);
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoadingForm(false);
    }
  };

  if (authState.loading) {
    return (
      <div>
        <Head title={"Dukaan | Coding Blocks"} />
        <Layout />
        <Loader />
      </div>
    );
  }

  if (!authState.loggedIn) {
    return (
      <div>
        <Head title={"Admin Login | Dukaan"} />
        <Layout />
        <div className="admin-auth-container">
          <div className="admin-auth-card">
            <h2>{isLogin ? 'Admin Login' : 'Admin Signup'}</h2>
            
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                      disabled={loadingForm}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                      disabled={loadingForm}
                    />
                  </div>
                </>
              )}
              
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loadingForm}
                />
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loadingForm}
                  minLength={6}
                />
              </div>

              <button type="submit" disabled={loadingForm}>
                {loadingForm ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </form>

            <p className="toggle-auth">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => !loadingForm && setIsLogin(!isLogin)}>
                {isLogin ? 'Sign up' : 'Login'}
              </span>
            </p>

            <div className="note">
              <strong>Note for Signup:</strong> After registration, your account needs to be manually upgraded to admin role.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authState.loggedIn && !authState.admin && !authState.finance_manager) {
    return (
      <div>
        <Head title={"Dukaan | Coding Blocks"} />
        <Layout />
        <div className={"not-logged-in"}>
          <h2>Welcome to Dukaan!</h2>
          <h3>You need to be an admin to view this page.</h3>
        </div>
      </div>
    );
  }

  if (authState.loggedIn && !authState.admin && authState.finance_manager) {
    return (
      <div>
        <Head title={"Dukaan | Coding Blocks"} />
        <Layout />
        <div className={"not-logged-in"}>
          <h2>Welcome to Dukaan!</h2>
          <div className="row justify-content-center">
            <div className="col-2">
              <a href="/admin/report">
                <div className="button-solid lg">
                  <button type="submit" className="pl-1">
                    Find Report
                  </button>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return props.children;
};

export default CheckLogin;
