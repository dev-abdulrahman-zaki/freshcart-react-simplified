import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import { FallingLines } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
// Import Context (cretead only)
import { authContext } from "../../context/Authentication";
import { CartContext } from "../../context/CartContext";
import { Helmet } from "react-helmet";

export default function SignIn() {
  const { setToken } = useContext(authContext);
  const { getUserCart } = useContext(CartContext);

  let user = {
    email: "",
    password: "",
  };

  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loader, setLoader] = useState(false);

  async function loginToAccount(values) {
    setLoader(true);
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        values
      );

      if (data.message === "success") {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        // getUserCart();

        setSuccessMsg("Welcome Back");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (e) {
      setErrorMsg(e.response.data.message);
    }

    setLoader(false);
  }

  const formikObj = useFormik({
    initialValues: user,
    onSubmit: loginToAccount,
    validate: function (values) {
      setErrorMsg(null);
      const errors = {};

      if (
        values.email.includes("@") === false ||
        values.email.includes(".") === false
      ) {
        errors.email = "Email Invalid";
      }

      if (values.password.length < 6 || values.password.length > 15) {
        errors.password = "Password must between 6 and 15 characters";
      }

      return errors;
    },
  });

  return (
    <>
      <Helmet>
        <title>SignIn</title>
      </Helmet>
      <div className="container py-5">
        {errorMsg ? <div className="alert alert-danger">{errorMsg}</div> : ""}
        {successMsg ? (
          <div className="alert alert-success">{successMsg}</div>
        ) : (
          ""
        )}

        <div className="signin-form">
          <form onSubmit={formikObj.handleSubmit}>
            <h2 className="mb-4 text-center">Sign In</h2>

            <div className="form-floating">
              <input
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
                value={formikObj.values.email}
                className="form-control mb-3"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
              />
              <label className="mb-2 form-label" htmlFor="email">
                Email
              </label>
            </div>
            {formikObj.errors.email && formikObj.touched.email ? (
              <div className="alert alert-danger">{formikObj.errors.email}</div>
            ) : (
              ""
            )}

            <div className="form-floating">
              <input
                onBlur={formikObj.handleBlur}
                onChange={formikObj.handleChange}
                value={formikObj.values.password}
                className="form-control mb-3"
                type="password"
                name="password"
                id="password"
                placeholder="password"
              />
              <label className="mb-2 form-label" htmlFor="password">
                Password
              </label>
            </div>
            {formikObj.errors.password && formikObj.touched.password ? (
              <div className="alert alert-danger">
                {formikObj.errors.password}
              </div>
            ) : (
              ""
            )}

            <div className="d-flex justify-content-between align-items-center">
              <Link to={`/forgotPassword`}>
                <p className="m-0 text-main cursor-pointer">Forgot Password?</p>
              </Link>
              <button
                disabled={
                  formikObj.isValid === false || formikObj.dirty === false
                }
                type="submit"
                className="btn bg-main text-white d-flex ms-auto"
              >
                {loader ? (
                  <FallingLines
                    color="#fff"
                    width="30"
                    visible={true}
                    ariaLabel="falling-lines-loading"
                  />
                ) : (
                  "SignIn"
                )}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-muted small">
          Don't have an account?
          <Link to={`/signup`}>
            <span className="ms-1 text-main cursor-pointer">Sign up here!</span>
          </Link>
        </p>
      </div>
    </>
  );
}
