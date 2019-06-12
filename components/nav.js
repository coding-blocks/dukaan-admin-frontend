import React from "react";
import Link from "next/link";
// import "../static/Css/App.css";

const Nav = () => (
  <nav className="main-nav">
    <div className="nav-left">
      <span className="hamburger-parent">
        <i className="hamburger fas fa-bars" />
      </span>
      <span className="logo-parent">
        <Link href="/">
          <a className="logo-link">
            <img
              src="../static/img/dukaan.png"
              className="nav-logo pointer"
            />
          </a>
        </Link>
      </span>
    </div>

    <div className="dsp-none-sm justify-content-center">
      <div className="nav-right">
        <ul className="nav-list">

          <li className="dropdown">
            <button className="dropbtn dropdown-toggle">
              COUPONS
              <i className="fa fa-caret-down" />
            </button>
            <div className = "dropdown-content">
              <div className="flex-row justify-content-center">
              <Link href="/admin/coupons">
                <a>All</a>
                </Link>
              </div>
              <div className="divider-h" />
              <div className="flex-row justify-content-center">
              <Link href="/admin/coupons/add">
                <a>Add New</a></Link>
              </div>
            </div>
          </li>

          <li className="dropdown">
                        <button className="dropbtn dropdown-toggle">PAYMENTS
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <div className="flex-row justify-content-center">
                            <Link href="/admin/payments">
                                <a>All</a></Link>
                            </div>
                            <div className="divider-h"></div>
                            <div className="flex-row justify-content-center">
                            <Link href="/admin/payments/add">
                                <a>Add New</a></Link>
                            </div>

                        </div>
                    </li>

                    <li className="dropdown">
                        <button className="dropbtn dropdown-toggle">PRODUCTS
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <div className="flex-row justify-content-center">
                            <Link href="/admin/products">
                                <a>All</a></Link>
                            </div>
                            <div className="divider-h"></div>
                            <div className="flex-row justify-content-center">
                            <Link href="/admin/products/add">
                                <a>Add New</a></Link>
                            </div>

                        </div>
                    </li>

                    <li className="dropdown">
                        <button className="dropbtn dropdown-toggle">Users
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <div className="flex-row justify-content-center">
                            <Link href="/admin/users">
                                <a>All</a></Link>
                            </div>
                            <div className="divider-h"></div>
                            <div className="flex-row justify-content-center">
                            <Link href="/admin/users/add">
                                <a>Add New</a></Link>
                            </div>

                        </div>
                    </li>

          <li className="nav-items pointer capitalize">
          <Link href="https://account.codingblocks.com">
            <a className="active">
              Hi, Tathagat
            </a></Link>
          </li>
          <li className="nav-items pointer">
            <form method="GET" action="/logout">
              <div className="button-solid lg">
                <button type="submit">Logout</button>
              </div>
            </form>
          </li>
        </ul>
      </div>
    </div>

  <style jsx>{`
  .dropdown {
            overflow: hidden;
            float: left;
            margin-left: 40px;

        }
        .dropdown .dropbtn {
            border: none;
            outline: none;
            font-family: inherit; /* Important for vertical align on mobile phones */
            margin: 0; /* Important for vertical align on mobile phones */
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f9f9f9;
        }


        /* Links inside the dropdown */
        .dropdown-content a {
            text-align: center;
            padding: 12px 16px;
            text-decoration: none;
        }

        .dropdown:hover .dropdown-content {
            display: block;
        }
      `}</style>
  </nav>
)

export default Nav;
