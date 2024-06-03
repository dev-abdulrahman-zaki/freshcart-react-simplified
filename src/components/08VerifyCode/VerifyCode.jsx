import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { FallingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export default function VerifyCode() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validationSchema = yup.object({
    resetCode: yup
      .number()
      .typeError("Verify Code must be a number")
      .required("Verify Code is required"),
  });

  const formikobj = useFormik({
    initialValues: {
      resetCode: "",
    },
    validationSchema,

    onSubmit: handleSubmitVerifyCode,
  });

  async function handleSubmitVerifyCode(values) {
    setLoading(true);

    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode`,
        {
          resetCode: `${values.resetCode.trim()}`,
        }
      );

      if (data.status === "Success") {
        navigate("/resetPassword");
      }
    } catch (error) {
      if (values.resetCode) toast.error(`${error.response.data.message}`);
    }
    setLoading(false);
  }

  return (
    <>
      <Helmet>
        <title>Verify Code</title>
      </Helmet>
      <div className="container py-5 ">
        <div className="py-3">
          <h2>Password assistance</h2>
          <hr />
        </div>
        <form onSubmit={formikobj.handleSubmit}>
          <label htmlFor="verifyCode" className="mb-2">
            Verify Code :
          </label>
          <input
            id="verifyCode"
            type="tel"
            placeholder="Enter Your Verify Code"
            className="form-control mb-2"
            name="resetCode"
            value={formikobj.values.resetCode}
            onChange={formikobj.handleChange}
            onBlur={formikobj.handleBlur}
          />
          {formikobj.errors.resetCode && formikobj.touched.resetCode ? (
            <div className="alert alert-danger">
              {formikobj.errors.resetCode}
            </div>
          ) : (
            ""
          )}

          <button
            disabled={formikobj.isValid === false || formikobj.dirty === false}
            type="submit"
            className="btn bg-main btnHover text-white d-flex ms-auto mt-4"
          >
            {loading ? (
              <FallingLines
                color="#fff"
                width="30"
                visible={true}
                ariaLabel="falling-lines-loading"
              />
            ) : (
              " Send"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
