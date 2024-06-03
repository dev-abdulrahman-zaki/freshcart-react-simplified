import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as yup from "yup";
import { useFormik } from "formik";
import { FallingLines } from "react-loader-spinner";

export default function Payment() {
  const { cartID, setNumOfCartItems, setTotalCartPrice, setCartProducts } =
    useContext(CartContext);
  const [methodType, setMethodType] = useState(null);
  const [cashLoading, setCashLoading] = useState(false);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const nav = useNavigate();

  const validationSchema = yup.object({
    phone: yup
      .string("phone must be string")
      .matches(/^(02)?01[0125][0-9]{8}$/, "Phone is invalid")
      .required("Phone is required"),
    city: yup
      .string("City must be string")
      .required("City is required")
      .max(15, "City must be less than 15 characters"),
    details: yup
      .string("Details must be string")
      .required("Details is required")
      .max(100, "Details must be less than 100 characters"),
  });

  const formikObj = useFormik({
    initialValues: {
      phone: "",
      city: "",
      details: "",
    },
    validationSchema,

    onSubmit: (values) => {
      // console.log(methodType);
      if (methodType === "cash") {
        paymentCash(values);
      } else {
        paymentOnline(values);
      }
    },
  });

  function handleChoosePaymentMethod(method) {
    setMethodType(method);
  }

  async function paymentCash(values) {
    setCashLoading(true);

    const shippingAddress = {
      shippingAddress: values,
    };

    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartID}`,
        shippingAddress,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      if (data?.status === "success") {
        toast.success("Payment Successfully");
        setNumOfCartItems(0);
        setTotalCartPrice(0);
        setCartProducts([]);
        setTimeout(() => {
          nav("/allorders");
        }, 1000);
      }
    } catch (error) {
      toast.error("Payment Failed");
      // console.log("Error : ", error);
    }
    setCashLoading(false);
  }

  async function paymentOnline(values) {
    setOnlineLoading(true);
    const shippingAddress = {
      shippingAddress: values,
    };
    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartID}`,
        shippingAddress,
        {
          headers: { token: localStorage.getItem("token") },
          params: { url: "https://fresh-cart-zaki.vercel.app/" },
        }
      );
      window.open(data.session.url);
    } catch (error) {
      toast.error("Payment Failed");
      // console.log("Error : ", error);
    }
    setOnlineLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Payment</title>
      </Helmet>
      <div className="container py-5">
        <form onSubmit={formikObj.handleSubmit}>
          <label htmlFor="phone" className="mb-2">
            Phone
          </label>
          <input
            name="phone"
            value={formikObj.values.phone}
            onChange={formikObj.handleChange}
            onBlur={formikObj.handleBlur}
            id="phone"
            type="tel"
            placeholder="phone"
            className="form-control mb-3"
          />
          {formikObj.errors.phone && formikObj.touched.phone ? (
            <div className="alert alert-danger">{formikObj.errors.phone}</div>
          ) : (
            ""
          )}
          <label htmlFor="city" className="mb-2">
            City
          </label>
          <input
            name="city"
            value={formikObj.values.city}
            onChange={formikObj.handleChange}
            onBlur={formikObj.handleBlur}
            id="city"
            type="text"
            placeholder="city"
            className="form-control mb-3"
          />
          {formikObj.errors.city && formikObj.touched.city ? (
            <div className="alert alert-danger">{formikObj.errors.city}</div>
          ) : (
            ""
          )}
          <label htmlFor="details" className="mb-2">
            Details
          </label>
          <textarea
            name="details"
            value={formikObj.values.details}
            onChange={formikObj.handleChange}
            onBlur={formikObj.handleBlur}
            id="details"
            type="tel"
            placeholder="Details"
            className="form-control mb-3"
          ></textarea>
          {formikObj.errors.details && formikObj.touched.details ? (
            <div className="alert alert-danger">{formikObj.errors.details}</div>
          ) : (
            ""
          )}
          <div className="d-flex justify-content-end flex-wrap gap-3 ">
            <button
              onClick={() => handleChoosePaymentMethod("online")}
              type="submit"
              className="btn btn-primary btnPayment flex-grow-1"
              id="online"
              disabled={
                formikObj.isValid === false || formikObj.dirty === false
              }
            >
              {onlineLoading ? (
                <FallingLines
                  color="#fff"
                  width="20"
                  visible={true}
                  ariaLabel="falling-lines-loading"
                />
              ) : (
                "Confirm Online Payment"
              )}
            </button>
            <button
              type="submit"
              id="cash"
              className="btn btn-primary btnPayment flex-grow-1"
              onClick={() => handleChoosePaymentMethod("cash")}
              disabled={
                formikObj.isValid === false || formikObj.dirty === false
              }
            >
              {cashLoading ? (
                <FallingLines
                  color="#fff"
                  width="20"
                  visible={true}
                  ariaLabel="falling-lines-loading"
                />
              ) : (
                "Confirm Cash Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
