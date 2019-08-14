import React, { useEffect, useState } from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import Swal from "sweetalert2";
import resourcesController from "../controllers/resources";
import purchasesController from "../controllers/purchases";
import Router from "next/router";

function ContinuePayment(props) {
  const [formValues, setFormValues] = useState({
    comment: "",
    paymentMode: "cash",
    quantity: "1",
    oneauthId: "" + props.oneauthId,
    cartId: props.cart_id,
    partialPayment: true
  });

  const [centers, setCenters] = useState([]);

  const [id, setId] = useState([]);

  useEffect(() => {
    setId(props.id);
  });

  useEffect(() => {
    resourcesController
      .handleGetCenters()
      .then(res => {
        setCenters(res.data);
      })
      .catch(error => {
        Swal.fire({
          type: "error",
          title: "Error while getting centers!",
          text: error
        });
      });
  }, []);

  useEffect(() => {
    setFormValues({
      comment: "",
      paymentMode: "cash",
      quantity: "1",
      oneauthId: "" + props.oneauthId,
      cartId: props.cart_id,
      partialPayment: true
    });
  }, [props.cart_id, props.oneauthId]);

  /**
   * Custom Validations for the continue payment form
   * @return {boolean} isValid – Returns a bool that tells
   *  if the form passed validation
   */
  const customValidations = () => {
    if (!document.getElementById("continue_payment_form").checkValidity()) {
      document.getElementById("continue_payment_form").reportValidity();
      return false;
    } else {
      return true;
    }
  };

  const onChangeValue = e => {
    // let newFormValues = { [e.target.name]: e.target.value };
    const name = e.target.name;
    console.log(name, "mc");
    const val = e.target.value;
    console.log(formValues);
    setFormValues(formValues => {
      return {
        ...formValues,
        [name]: val
      };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (customValidations()) {
      const result = await Swal.fire({
        title: "Are you sure you want to make a new payment?",
        type: "question",
        confirmButtonColor: "#f66",
        confirmButtonText: "Yes!",
        cancelButtonText: "No!",
        showCancelButton: true,
        showConfirmButton: true,
        showCloseButton: true
      });

      if (!result.value) return;

      const data = formValues;
      purchasesController
        .handleCreateNewPurchase(data)
        .then(res => {
          Swal.fire({
            title: "Payment successful!",
            type: "success",
            timer: 3000,
            showConfirmButton: true,
            confirmButtonText: "Okay"
          });

          Router.push(`/admin/orders?id=${id}`);
        })
        .catch(error => {
          Swal.fire({
            title: "Error while making payment!",
            type: "error",
            text: error,
            showConfirmButton: true
          });
        });
    }
  };

  const PaymentMethod = () => {
    console.log(formValues.paymentMode, "tttttttt");
    if (formValues.paymentMode === "cheque") {
      return (
        <div>
          <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Your Location"
              name={"chequeLocation"}
              onChange={onChangeValue}
              value={formValues.chequeLocation}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Serial Number"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Serial Number"
              name={"serialNumber"}
              onChange={onChangeValue}
              value={formValues.serialNumber}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Bank Name"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Your Bank Name"
              name={"bank"}
              onChange={onChangeValue}
              value={formValues.bank}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Branch Name"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Your Branch Name"
              name={"branch"}
              onChange={onChangeValue}
              value={formValues.branch}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
            <input
              type="date"
              className={"input-text"}
              placeholder="Select Date"
              name={"issueDate"}
              onChange={onChangeValue}
              value={formValues.issueDate}
            />
          </FieldWithElement>
          <div className="divider-h mb-5 mt-5" />
        </div>
      );
    } else if (formValues.paymentMode === "neft") {
      return (
        <div>
          <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Your Location"
              name={"neftLocation"}
              onChange={onChangeValue}
              value={formValues.neftLocation}
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
              onChange={onChangeValue}
              value={formValues.neftUtr}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
            <input
              type="date"
              className={"input-text"}
              placeholder="Select Date"
              name={"neftDate"}
              onChange={onChangeValue}
              value={formValues.neftDate}
            />
          </FieldWithElement>
          <div className="divider-h mb-5 mt-5" />
        </div>
      );
    } else if (formValues.paymentMode === "swipe") {
      return (
        <div>
          <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Your Location"
              name={"swipeLocation"}
              onChange={onChangeValue}
              value={formValues.swipeLocation}
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
              onChange={onChangeValue}
              value={formValues.swipeUtr}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
            <input
              type="date"
              className={"input-text"}
              placeholder="Select Date"
              name={"swipeDate"}
              onChange={onChangeValue}
              value={formValues.swipeDate}
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
      <div className={"border-card coupon-card "}>
        {/* Title */}
        <div className={"d-flex justify-content-center mt-1 pb-3"}>
          <h2 className={"title red"}>Continue Payment</h2>
        </div>
        <div className={"d-flex justify-content-center mt-1 pb-3"}>
          <h3>
            Amount Left <span className="red">₹ {props.amountLeft}</span>
          </h3>
        </div>

        <div className="divider-h mb-2 mt-2" />

        <form id="continue_payment_form">
          <FieldWithElement
            name={"Payment Center"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select name="paymentCenterId" onChange={onChangeValue} required>
              <option value="" selected>
                Select Payment Center
              </option>
              {centers.map(center => {
                return (
                  <option value={center.id} key={center.id}>
                    {center.name}
                  </option>
                );
              })}
            </select>
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Comment"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Write Your Comment Here"
              name={"comment"}
              onChange={onChangeValue}
              value={formValues.mobile_number}
            />
          </FieldWithElement>

          <FieldWithElement
            name={"Choose Payment Method"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select name="paymentMode" onChange={onChangeValue}>
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
            className="red"
            nameCols={3}
            elementCols={9}
            name={"Partial Amount (Rs.)"}
          >
            <input
              type="text"
              className={"input-text"}
              name={"partialAmount"}
              onChange={onChangeValue}
              value={formValues.partialAmount}
              pattern={"[0-9]{1,10}"}
              title={"Partial amount can only be numbers"}
              required
            />
            <span className="red">
              Partial amount cannot be less than Rs. 20
            </span>
          </FieldWithElement>

          <div className={"d-flex justify-content-center"}>
            <button
              id="search"
              className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
              onClick={handleSubmit}
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContinuePayment;
