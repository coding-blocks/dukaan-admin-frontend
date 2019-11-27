import React from "react";
import Link from "next/link";
import Cookies from 'js-cookie'
import jwt from "jsonwebtoken";
import config from "../config";
import "../styles/components/layout.scss";

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Guest",
      pic: "../static/img/guest-user.jpg",
      loggedIn: false,
      admin: false
    };
  }

  componentDidMount() {
    const dukaanToken = Cookies.get("dukaan-token");
    if (dukaanToken) {
      const userInfo = jwt.decode(dukaanToken);
      this.setState({
        name: userInfo.data.firstname + " " + userInfo.data.lastname,
        pic: userInfo.data.photo,
        loggedIn: true,
        admin: userInfo.data.role !== "user"
      });
    }
  }

  render() {
    return (
      <div>
        <nav className="main-nav">
          <div className="nav-left">
            <span className="hamburger-parent">
              <i className="hamburger fas fa-bars" />
            </span>
            <span className="logo-parent">
              <Link href="/">
                <a className="logo-link">
                  <img
                    src="/static/img/dukaan.png"
                    className="nav-logo pointer"
                  />
                </a>
              </Link>
            </span>
          </div>

          <div className="dsp-none-sm justify-content-center">
            <div className="nav-right">
              <ul className="nav-list">
                {this.state.loggedIn && this.state.admin && (
                  <div>
                    <li className="dropdown">
                      <button className="dropbtn dropdown-toggle">
                        Coupons
                        <i className="fa fa-caret-down pl-2" />
                      </button>
                      <div className="dropdown-content">
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/coupons">
                            <a>All</a>
                          </Link>
                        </div>
                        <div className="divider-h" />
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/coupons/add">
                            <a>Add New</a>
                          </Link>
                        </div>
                      </div>
                    </li>

                    <li className="dropdown">
                      <button className="dropbtn dropdown-toggle">
                        Products
                        <i className="fa fa-caret-down pl-2" />
                      </button>
                      <div className="dropdown-content">
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/products">
                            <a>All</a>
                          </Link>
                        </div>
                        <div className="divider-h" />
                        <div className="flex-row justify-content-center">
                          <Link href="/admin/products/add">
                            <a>Add New</a>
                          </Link>
                        </div>
                      </div>
                    </li>
                  </div>
                )}
                <li className="nav-items pointer capitalize">
                  <img
                    src={this.state.pic}
                    className={"pic"}
                    width={48}
                    height={48}
                    align={"absmiddle"}
                  />
                  <Link href="https://account.codingblocks.com">
                    <a className="active name">Hi, {this.state.name}</a>
                  </Link>
                </li>
                {this.state.loggedIn && (
                  <li className="nav-items pointer">
                    <a href="/logout">
                      <div className="button-solid lg">
                        <button type="submit" className="pl-1">
                          Logout
                        </button>
                      </div>
                    </a>
                  </li>
                )}
                {!this.state.loggedIn && (
                  <li className="nav-items pointer">
                    <a href="/login">
                      <div className="button-solid lg">
                        <button type="submit" className="pl-1">
                          Sign in
                        </button>
                      </div>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
