import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { FallingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup
      .string("Email must be a string")
      .required("Email is required")
      .email("Email must be valid"),
    newPassword: yup
      .string("Password must be a String")
      .required("Password is required")
      .min(6, "password must be more than 6 characters")
      .max(15, "Password must be less than 15 characters"),
  });

  const formikobj = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
    },
    validationSchema,

    onSubmit: handleSubmitResetPassword,
  });

  async function handleSubmitResetPassword(values) {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/auth/resetPassword`,
        values
      );

      if (data.token) {
        navigate("/signin");
      }
    } catch (error) {
      toast.error("Failed to reset new password");
    }
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <div className="container py-5 ">
        <div className="py-3">
          <h2>Reset Password: </h2>
          <hr />
        </div>
        <form onSubmit={formikobj.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="mb-2">
              Email :
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter Your Email"
              className="form-control mb-2"
              name="email"
              value={formikobj.values.email}
              onChange={formikobj.handleChange}
              onBlur={formikobj.handleBlur}
            />
            {formikobj.errors.email && formikobj.touched.email ? (
              <div className="alert alert-danger">{formikobj.errors.email}</div>
            ) : (
              ""
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="newPassword" className="mb-2">
              New Password :
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter New Password"
              className="form-control mb-2"
              name="newPassword"
              value={formikobj.values.newPassword}
              onChange={formikobj.handleChange}
              onBlur={formikobj.handleBlur}
            />
            {formikobj.errors.newPassword && formikobj.touched.newPassword ? (
              <div className="alert alert-danger">
                {formikobj.errors.newPassword}
              </div>
            ) : (
              ""
            )}
          </div>

          <button
            disabled={formikobj.isValid === false || formikobj.dirty === false}
            type="submit"
            className="btn bg-main btnHover text-white d-flex ms-auto"
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
    </>
  );
}
