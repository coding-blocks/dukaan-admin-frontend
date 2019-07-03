webpackHotUpdate("static/development/pages/index.js",{

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime-corejs2/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/createClass */ "./node_modules/@babel/runtime-corejs2/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime-corejs2/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime-corejs2/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime-corejs2/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/inherits */ "./node_modules/@babel/runtime-corejs2/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _components_Head__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/Head */ "./components/Head.js");
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/Layout */ "./components/Layout.js");
/* harmony import */ var _components_CompleteOrder__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../components/CompleteOrder */ "./components/CompleteOrder.js");
/* harmony import */ var _components_AddUser__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../components/AddUser */ "./components/AddUser.js");
/* harmony import */ var _components_NewPayment__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../components/NewPayment */ "./components/NewPayment.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_16__);









var _jsxFileName = "/Users/tathagatthapliyal/Desktop/MyGems/Projects/CodingBlocks/dukaan-admin-frontend/pages/index.js";






 // import "semantic-ui-css/semantic.min.css";
// import axios from '../config'



var Home =
/*#__PURE__*/
function (_React$Component) {
  Object(_babel_runtime_corejs2_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_7__["default"])(Home, _React$Component);

  function Home(props) {
    var _this;

    Object(_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Home);

    _this = Object(_babel_runtime_corejs2_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, Object(_babel_runtime_corejs2_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Home).call(this, props));

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this), "handleChange", function (event) {
      _this.setState(Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])({}, event.target.name, event.target.value));
    });

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this), "toggleCompleteTab", function () {
      _this.setState(function (prevstate) {
        return {
          completeTab: true,
          incompleteTab: false
        };
      });
    });

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this), "toggleIncompleteTab", function () {
      _this.setState(function (prevstate) {
        return {
          completeTab: false,
          incompleteTab: true
        };
      });
    });

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this), "handleNewPayment", function () {
      _this.setState({
        newpayment: true
      });
    });

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this), "handleSearch",
    /*#__PURE__*/
    Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
    /*#__PURE__*/
    _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      var userData;
      return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.setState({
                email: "",
                completeTab: true,
                incompleteTab: false,
                userFound: false,
                userInfo: {},
                courseInfo: null,
                createUser: false,
                newpayment: false
              });

              _context.next = 3;
              return axios__WEBPACK_IMPORTED_MODULE_16___default.a.get("http://localhost:2929/api/v2/admin/users?email=".concat(_this.state.email), {
                headers: {
                  "dukaan-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNsaWVudE5hbWUiOiJvbmxpbmVDYiIsIm9uZWF1dGhJZCI6MTQ1OSwicHJvZHVjdElkIjoxNTYsInF1YW50aXR5IjoxfSwiaWF0IjoxNTYwMjQwNzkwfQ.x6pSdQA2bQndnnMoxSgwn6GdKiPmm82E8AE2BPIPRRQ"
                }
              });

            case 3:
              userData = _context.sent;

              _this.setState({
                userInfo: userData.data[0]
              });

              console.log(userData.data[0]);
              axios__WEBPACK_IMPORTED_MODULE_16___default.a.get("http://localhost:2929/api/v2/admin/purchases?user_id=".concat(_this.state.userInfo.id), {
                headers: {
                  "dukaan-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNsaWVudE5hbWUiOiJvbmxpbmVDYiIsIm9uZWF1dGhJZCI6MTQ1OSwicHJvZHVjdElkIjoxNTYsInF1YW50aXR5IjoxfSwiaWF0IjoxNTYwMjQwNzkwfQ.x6pSdQA2bQndnnMoxSgwn6GdKiPmm82E8AE2BPIPRRQ"
                }
              }).then(function (res) {
                console.log(res);

                _this.setState({
                  courseInfo: res.data
                });
              }).catch(function (err) {
                console.log(err);

                _this.setState({
                  courseInfo: null
                });
              });

              if (userData) {
                _this.setState({
                  userFound: true
                });

                console.log(userData.data[0]);
              } else {
                console.log("no user found");
              }

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_corejs2_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_6__["default"])(_this), "handleCreateUser", function () {
      console.log("clicked");

      _this.setState({
        createUser: true
      });
    });

    _this.state = {
      email: "",
      completeTab: true,
      incompleteTab: false,
      userFound: false,
      userInfo: null,
      courseInfo: null,
      createUser: false,
      newpayment: false
    };
    return _this;
  }

  Object(_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Home, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var orders;
      var completeTab = this.state.completeTab;

      if (completeTab && this.state.userFound && this.state.courseInfo !== null && !this.state.newpayment) {
        console.log(this.state.courseInfo);
        orders = this.state.courseInfo.completePayments.map(function (coursePurchased) {
          // console.log(coursePurchased);
          return react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_components_CompleteOrder__WEBPACK_IMPORTED_MODULE_13__["default"], {
            key: coursePurchased.id,
            image: coursePurchased.product.image_url,
            product_name: coursePurchased.product.name,
            status: coursePurchased.cart.transactions[0].status,
            amount: coursePurchased.amount,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 135
            },
            __self: this
          });
        });
      } else if (this.state.newpayment) {
        orders = react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_components_NewPayment__WEBPACK_IMPORTED_MODULE_15__["default"], {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 145
          },
          __self: this
        });
      } else if (completeTab) {
        orders = react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 147
          },
          __self: this
        }, "No Complete Orders Found.");
      } else {
        orders = react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 149
          },
          __self: this
        }, "No Incomplete Orders Found.");
      }

      var Usercard = function Usercard() {
        if (_this2.state.userFound) {
          return react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: " mt-4",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 155
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: "row w-100",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 156
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: "col-md-4 col-12",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 157
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: "border-card br-20 bg-light-grey mb-5",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 158
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("h5", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 159
            },
            __self: this
          }, "User Details"), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            style: {
              alignItems: "center"
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 160
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("p", {
            className: "red",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 165
            },
            __self: this
          }, "Username : ", _this2.state.userInfo.username), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("p", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 169
            },
            __self: this
          }, "Name : ", _this2.state.userInfo.firstname, " ", _this2.state.userInfo.lastname), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("p", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 174
            },
            __self: this
          }, "Email : ", _this2.state.userInfo.email), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("p", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 176
            },
            __self: this
          }, "Mobile : ", _this2.state.userInfo.mobile_number), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("p", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 178
            },
            __self: this
          }, "Wallet Amount : \u20B9 ", _this2.state.userInfo.wallet_amount), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 180
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("button", {
            className: "button-solid",
            onClick: _this2.handleNewPayment,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 181
            },
            __self: this
          }, "Make New Payment"))))), !_this2.state.newpayment ? react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: "col-md-8 col-12",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 192
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: "border-card br-20 bg-light-grey mb-5",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 193
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: "tab-nav-underline mb-5",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 194
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: _this2.state.completeTab ? "tab active" : "tab",
            onClick: _this2.toggleCompleteTab,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 195
            },
            __self: this
          }, "Complete Orders"), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: _this2.state.incompleteTab ? "tab active" : "tab",
            onClick: _this2.toggleIncompleteTab,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 203
            },
            __self: this
          }, "Incomplete Orders")), orders)) : react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_components_NewPayment__WEBPACK_IMPORTED_MODULE_15__["default"], {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 216
            },
            __self: this
          })));
        } else {
          return react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: " mt-4",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 223
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: "row w-100",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 224
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: "col-md-4 col-12",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 225
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            className: "border-card br-20 bg-light-grey mb-5",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 226
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("h5", {
            style: {
              textAlign: "center"
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 227
            },
            __self: this
          }, "No user Found, Search Existing?", " "), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("h5", {
            className: "mt-4",
            style: {
              textAlign: "center"
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 230
            },
            __self: this
          }, "OR"), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
            style: {
              textAlign: "center"
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 233
            },
            __self: this
          }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("button", {
            className: "button-solid p-3 mt-4",
            onClick: _this2.handleCreateUser,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 234
            },
            __self: this
          }, "Create New User")))), _this2.state.createUser ? react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_components_AddUser__WEBPACK_IMPORTED_MODULE_14__["default"], {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 243
            },
            __self: this
          }) : ""));
        }
      };

      return react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 251
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_components_Head__WEBPACK_IMPORTED_MODULE_11__["default"], {
        title: "Coding Blocks | Dukaan",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 252
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(_components_Layout__WEBPACK_IMPORTED_MODULE_12__["default"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 253
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
        className: "container mt-4",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 256
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
        className: "row",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 257
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
        className: "col-md-12 col-12",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 258
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("div", {
        style: {
          display: "flex"
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 259
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("input", {
        name: "email",
        required: true,
        id: "email",
        type: "email",
        className: "input-text mb-2",
        placeholder: "Enter email",
        onChange: this.handleChange,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 260
        },
        __self: this
      }), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement("button", {
        id: "search",
        className: "button-solid ml-4 mb-1",
        style: {
          fontSize: "1.3rem"
        },
        onClick: this.handleSearch,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 269
        },
        __self: this
      }, "Search")))), react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement(Usercard, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 281
        },
        __self: this
      })));
    }
  }]);

  return Home;
}(react__WEBPACK_IMPORTED_MODULE_9___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (Home);

/***/ })

})
//# sourceMappingURL=index.js.a0034bed8ef53ceb4f70.hot-update.js.map