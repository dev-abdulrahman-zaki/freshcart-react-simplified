import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { FallingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import fpImage from "../../assets/imgs/forgotPassword.svg";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup
      .string("Email must be a string")
      .required("Email is required")
      .email("Email must be valid"),
  });

  const formikobj = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: handleSubmitEmail,
  });

  async function handleSubmitEmail(values) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords`,
        values
      );

      if (data.statusMsg === "success") {
        navigate("/verifyCode");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <div className="container py-5">
        <div className="py-3">
          <h2>Password assistance</h2>
          <hr />
        </div>

        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2 text-center">
            <img src={fpImage} alt="" className="img-fluid" />
          </div>
          <div className="col-12 col-md-6 col-lg-4 order-lg-2 order-1 d-flex align-items-center justify-content-center offset-lg-1">
            <form className="w-100" onSubmit={formikobj.handleSubmit}>
              <input
                id="email"
                type="email"
                placeholder="Enter Your Email"
                className="form-control mb-2"
                name="email"
                value={formikobj.values.email}
                onChange={formikobj.handleChange}
                onBlur={formikobj.handleBlur}
              />
              {formikobj.errors.email && formikobj.touched.email ? (
                <div className="alert alert-danger">
                  {formikobj.errors.email}
                </div>
              ) : (
                ""
              )}

              <button
                disabled={
                  formikobj.isValid === false || formikobj.dirty === false
                }
                type="submit"
                className="btn bg-main btnHover text-white d-flex ms-auto mt-2"
              >
                {loading ? (
                  <FallingLines
                    color="#fff"
                    width="30"
                    visible={true}
                    ariaLabel="falling-lines-loading"
                  />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
