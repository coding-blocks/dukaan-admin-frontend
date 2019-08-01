import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import "../controllers/config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Price from "../components/Price";
import formatter from "../helpers/formatter";
import purchasesController from "../controllers/purchases";
import resourcesController from "../controllers/resources";
import productsController from "../controllers/products";
import productCategoriesController from "../controllers/productcategories";
class NewPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      product_categories: [],
      products: [],
      product_category: "1",
      amount: "",
      min_emi: "",
      centers: [],
      formValues: {
        coupon: "",
        comment: "",
        paymentMode: "cash",
        quantity: "1",
        stateId: "AP",
        oneauthId: "" + props.userid
      }
    };
    this.ReactSwal = withReactContent(Swal);
  }

  componentDidMount() {
    Promise.all([
      resourcesController.handleGetStates(),
      productCategoriesController.handleGetAllProductCategories(),
      productsController.handleGetProducts({
        'product_category_id': this.state.product_category
      }, {
        page: 1,
        limit: 100
      }),
      resourcesController.handleGetCenters()
    ]).then(([res1, res2, res3, res4]) => {
      let fetchedProducts = [];
      res3.results.map(product => {
        fetchedProducts.push(product);
      });
      this.setState({
        centers: res4.data,
        states: res1.data,
        products: fetchedProducts,
        product_categories: res2.data
      });
    }).catch((error) => {
      Swal.fire({
        type: "error",
        title: "Error fetching data!",
        text: error
      })
    });
  }

  calculateAmount = (e) => {
    e.preventDefault();
    const data = {
      coupon: this.state.formValues.coupon,
      oneauthId: this.props.userid,
      productId: this.state.formValues.productId,
      quantity: this.state.formValues.quantity
    };

    productsController.handleCalculatePrice(data).then((res) => {
      if (res.data.amount) {
        this.setState({
          amount: res.data.amount
        });
      }
    }).catch((error) => {
      Swal.fire({
        type: 'error',
        text: error,
        title: 'Error calculating price!'
      });
    });
  };

  handleProductCategory = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    let productCategory = e.target.value;
    productsController.handleGetProducts({
      product_category_id:  productCategory
    }, {
      page: 1,
      limit: 100
    }).then((res) => {
      this.setState({
        products: res.results
      })
    }).catch((error) => {
      Swal.fire({
        type: 'error',
        text: error,
        title: 'Error grabbing products by categories!'
      });
    });
  };

  onChangeValue = e => {
    let newFormValues = this.state.formValues;
    newFormValues[e.target.name] = e.target.value;
    this.setState({
      formValues: newFormValues
    });
  };

  onChangeHandler = e => {
    let newFormValues = this.state.formValues;
    newFormValues[e.target.name] = e.target.value;
    let min_emi = e.target.selectedOptions[0].dataset.emi / 100;
    console.log(min_emi);
    this.setState({
      min_emi: min_emi,
      formValues: newFormValues
    });
  };

  toggleCheck = e => {
    let newFormValues = this.state.formValues;
    newFormValues[e.target.name] = e.target.checked;

    this.setState({
      formValues: newFormValues
    });
  };

  /**
   * Custom Validations for the new payment form
   * @return {boolean} isValid – Returns a bool that tells
   *  if the form passed validation
   */
  customValidations = () => {
    if (!document.getElementById("new_payment_form").checkValidity()) {
      document.getElementById("new_payment_form").reportValidity();
      return false;
    }
    if (this.state.min_emi > this.state.formValues.partialAmount) {
      Swal.fire({
        title: "Error adding new payment!",
        text: `Partial payment cannot be less than ${this.state.min_emi}`,
        type: 'error'
      });
      return false;
    }
    return true;
  };

  handleSubmit = async e => {
    e.preventDefault();
    if (this.customValidations()) {
      Swal.fire({
        title: "Are you sure you want to make a new payment?",
        type: "question",
        confirmButtonColor: "#f66",
        confirmButtonText: "Yes!",
        cancelButtonText: "No!",
        showCancelButton: true,
        showConfirmButton: true,
        showCloseButton: true
      }).then(result => {
        if (result.value) {
          // Confirmation passed, delete coupon.
          const data = this.state.formValues;
          var formBody = [];
          for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");

          purchasesController.handleCreateNewPurchase(formBody).then(() => {
            Swal.fire({
              title: "Payment has been recorded successfully!",
              type: "success",
              timer: "3000",
              showConfirmButton: true,
              confirmButtonText: "Okay"
            });
            // this.setState({
            //   formValues: {
            //     coupon: "",
            //     comment: "",
            //     paymentMode: "cash",
            //     quantity: "1",
            //     stateId: "AP",
            //     oneauthId: "" + this.props.userid
            //   }
            // });
          //   setTimeout(() => {
          //     window.location.reload("/");
          //   }, 3000);
          })
          .catch(err => {
            console.log(err);
            Swal.fire({
              title: "Error while making payment!",
              text: error,
              type: "error",
              showConfirmButton: true
            });
          });
        }
      });
    }
  };

  render() {
    const PaymentMethod = () => {
      if (this.state.formValues.paymentMode === "cheque") {
        return (
          <div>
            <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
              <input
                type="text"
                className={"input-text"}
                placeholder="Enter Your Location"
                name={"chequeLocation"}
                onChange={this.onChangeValue}
                value={this.state.formValues.chequeLocation}
              />
            </FieldWithElement>

            <FieldWithElement
              nameCols={3}
              elementCols={9}
              name={"Serial Number"}
            >
              <input
                type="text"
                className={"input-text"}
                placeholder="Enter Serial Number"
                name={"serialNumber"}
                onChange={this.onChangeValue}
                value={this.state.formValues.serialNumber}
              />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Bank Name"}>
              <input
                type="text"
                className={"input-text"}
                placeholder="Enter Your Bank Name"
                name={"bank"}
                onChange={this.onChangeValue}
                value={this.state.formValues.bank}
              />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Branch Name"}>
              <input
                type="text"
                className={"input-text"}
                placeholder="Enter Your Branch Name"
                name={"branch"}
                onChange={this.onChangeValue}
                value={this.state.formValues.branch}
              />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
              <input
                type="date"
                className={"input-text"}
                placeholder="Select Date"
                name={"issueDate"}
                onChange={this.onChangeValue}
                value={this.state.formValues.issueDate}
              />
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5" />
          </div>
        );
      } else if (this.state.formValues.paymentMode === "neft") {
        return (
          <div>
            <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
              <input
                type="text"
                className={"input-text"}
                placeholder="Enter Your Location"
                name={"neftLocation"}
                onChange={this.onChangeValue}
                value={this.state.formValues.neftLocation}
              />
            </FieldWithElement>

            <FieldWithElement
              nameCols={3}
              elementCols={9}
              name={"NEFT Transaction ID"}
            >
              <input
                type="text"
                className={"input-text"}
                placeholder="Enter Your Transaction ID"
                name={"neftUtr"}
                onChange={this.onChangeValue}
                value={this.state.formValues.neftUtr}
              />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
              <input
                type="date"
                className={"input-text"}
                placeholder="Select Date"
                name={"neftDate"}
                onChange={this.onChangeValue}
                value={this.state.formValues.neftDate}
              />
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5" />
          </div>
        );
      } else if (this.state.formValues.paymentMode === "swipe") {
        return (
          <div>
            <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
              <input
                type="text"
                className={"input-text"}
                placeholder="Enter Your Location"
                name={"swipeLocation"}
                onChange={this.onChangeValue}
                value={this.state.formValues.swipeLocation}
              />
            </FieldWithElement>

            <FieldWithElement
              nameCols={3}
              elementCols={9}
              name={"SWIPE Transaction ID"}
            >
              <input
                type="text"
                className={"input-text"}
                placeholder="Enter Your Swipe ID"
                name={"swipeUtr"}
                onChange={this.onChangeValue}
                value={this.state.formValues.swipeUtr}
              />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
              <input
                type="date"
                className={"input-text"}
                placeholder="Select Date"
                name={"swipeDate"}
                onChange={this.onChangeValue}
                value={this.state.formValues.swipeDate}
              />
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5" />
          </div>
        );
      } else {
        return <div />;
      }
    };
    return (
      <div className={"d-flex align-items-center col-md-8"}>
        <form id="new_payment_form">
          <div className={"border-card coupon-card "}>
            {/* Title */}
            <div className={"d-flex justify-content-center mt-1 pb-3"}>
              <h2 className={"title red"}>Make New Payment</h2>
            </div>

            {/* username */}
            <FieldWithElement
              name={"Select Category For Course"}
              nameCols={3}
              elementCols={9}
              elementClassName={"pl-4"}
            >
              <select
                name="product_category"
                onChange={this.handleProductCategory}
                required
              >
                <option value="" selected>Select Category</option>
                {this.state.product_categories.map(category => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </FieldWithElement>

            <FieldWithElement
              name={"Select Course"}
              nameCols={3}
              elementCols={9}
              elementClassName={"pl-4"}
            >
              <select
                id="course"
                name="productId"
                required
                onChange={this.onChangeHandler}
              >
                <option value="" selected>Select Course</option>
                {this.state.products.map(product => {
                  return (
                    <option
                      data-emi={product.emi_min_base}
                      value={product.id}
                      key={product.id}
                    >
                      {product.name} at {formatter.formatCurrency(product.mrp / 100)}
                    </option>
                  );
                })}
              </select>
            </FieldWithElement>

            <FieldWithElement
              name={"Selling State"}
              nameCols={3}
              elementCols={9}
              elementClassName={"pl-4"}
            >
              <select name="stateId" onChange={this.onChangeValue}>
                {this.state.states.map(state => {
                  return (
                    <option value={state.state_code} key={state.id}>
                      {state.name}
                    </option>
                  );
                })}
              </select>
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5" />
            {/* gender */}
            <FieldWithElement
              name={"Payment Center"}
              nameCols={3}
              elementCols={9}
              elementClassName={"pl-4"}
              
            >
              <select name="paymentCenterId" required onChange={this.onChangeValue}>
              <option value="" selected>
                  Select Payment Center
                </option>
                {this.state.centers.map(center => {
                  return (
                    <option value={center.id} key={center.id}>
                      {center.name}
                    </option>
                  );
                })}
              </select>
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={4} name={"Coupon Code"}>
              <input
                type="text"
                className={"input-text"}
                placeholder="Coupon Code"
                name={"coupon"}
                onChange={this.onChangeValue}
                value={this.state.formValues.mobile_number}
              />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Comment"}>
              <input
                type="text"
                className={"input-text"}
                placeholder="Write Your Comment Here"
                name={"comment"}
                onChange={this.onChangeValue}
                value={this.state.formValues.mobile_number}
              />
            </FieldWithElement>

            <FieldWithElement
              className="red"
              nameCols={3}
              elementCols={4}
              name={"Total Amount (Rs.) = (Price - Discount - Credits) + Tax :"}
            >
              {/* <input
                type="text"
                className={"input-text"}
                name={"amount"}
                onChange={this.onChangeValue}
                value={this.state.amount}
                readOnly
              /> */}
              <Price amount={this.state.amount} />
            </FieldWithElement>

            <div className={"d-flex"}>
              <button
                id="search"
                className={"button-solid mb-2 mt-4 pl-5 pr-5"}
                onClick={this.calculateAmount}
              >
                Calculate Amount
              </button>
            </div>
            <div className="divider-h mb-5 mt-5" />

            {/* code */}

            {/* Colleges */}
            <FieldWithElement
              name={"Choose Payment Method"}
              nameCols={3}
              elementCols={9}
              elementClassName={"pl-4"}
            >
              <select name="paymentMode" onChange={this.onChangeValue}>
                <option selected value="cash">
                  CASH
                </option>
                <option value="neft">NEFT</option>
                <option value="cheque">CHEQUE</option>
                <option value="swipe">SWIPE</option>
              </select>
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5" />
            {PaymentMethod()}

            <FieldWithElement
              name={"Partial Payment"}
              nameCols={3}
              elementCols={9}
              elementClassName={"pl-4"}
            >
              <div className="mt-2">
                <label
                  className="input-checkbox checkbox-tick font-sm"
                  for="tick"
                  value={this.state.partial_checked}
                >
                  <input
                    type="checkbox"
                    id="tick"
                    defaultValue={this.state.formValues.partialPayment}
                    name="partialPayment"
                    onChange={this.toggleCheck}
                  />{" "}
                  Click For Partial Payment
                  <span />
                </label>
              </div>
            </FieldWithElement>

            {this.state.formValues.partialPayment ? (
              <FieldWithElement
                className="red"
                nameCols={3}
                elementCols={9}
                name={"Partial Amount (Rs.)"}
              >
                <input
                  type="text"
                  className={"input-text"}
                  name={"partialAmount"}
                  onChange={this.onChangeValue}
                  value={this.state.formValues.partialAmount}
                  pattern={"[0-9]{1,10}"}
                  required={this.state.formValues.partialPayment}
                  title={"Partial amount can only be in numbers"}
                />
                <span className="red">
                  Partial amount cannot be less than Rs. {this.state.min_emi}
                </span>
              </FieldWithElement>
            ) : (
              ""
            )}

            <div className={"d-flex justify-content-center"}>
              <button
                id="search"
                className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                onClick={this.handleSubmit}
              >
                Record Payment
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default NewPayment;
