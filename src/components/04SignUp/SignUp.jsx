import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FallingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import SignupImage from "../../assets/imgs/signup.svg";

export default function SignUp() {

  let user = {
    name: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
  };

  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loader, setLoader] = useState(false);

  async function addNewUser(values) {
    setLoader(true);
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        values
      );

      if (data.message === "success") {
        setSuccessMsg("Account Has Created Successfully");
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      }
    } catch (e) {
      // console.log(e.response.data.message);
      setErrorMsg(e.response.data.message);
    }

    setLoader(false);
  }


  const formikObj = useFormik({
    initialValues: user,
    onSubmit: addNewUser,
    validate: function (values) {
      setErrorMsg(null);
      const errors = {};

      if (values.name.length < 4 || values.name.length > 20) {
        errors.name = "Name must be between 4 and 20 characters";
      }

      if (
        values.email.includes("@") === false ||
        values.email.includes(".") === false
      ) {
        errors.email = "Email Invalid";
      }

      if (!values.phone.match(/^(02)?01[0125][0-9]{8}$/)) {
        errors.phone = "Phone Invalid";
      }

      if (values.password.length < 6 || values.password.length > 15) {
        errors.password = "Password must between 6 and 15 characters";
      }

      if (values.rePassword !== values.password) {
        errors.rePassword = "Password and rePassword not matched";
      }

      return errors;
    },
  });


  return (
    <>
      <Helmet>
        <title>SignUp</title>
      </Helmet>


      <div className="container py-5">
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <div className="mb-4">
          <h2>SignUp</h2>
          <hr />
        </div>

        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2 text-center">
            <img src={SignupImage} alt="" className="img-fluid" />
          </div>

          <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1 d-flex align-items-center justify-content-center">
            <form className="w-100" onSubmit={formikObj.handleSubmit}>

              {/* Name */}
              <div className="form-floating">
                <input
                  onBlur={formikObj.handleBlur}
                  onChange={formikObj.handleChange}
                  value={formikObj.values.name}
                  className="form-control mb-3"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                />
                <label className="mb-2 form-label" htmlFor="name">
                  Name
                </label>
              </div>
              {formikObj.errors.name && formikObj.touched.name && (
                <div className="alert alert-danger">
                  {formikObj.errors.name}
                </div>
              )}


              {/* Email */}
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
              {formikObj.errors.email && formikObj.touched.email && (
                <div className="alert alert-danger">
                  {formikObj.errors.email}
                </div>
              )}


              {/* Phone */}
              <div className="form-floating">
                <input
                  onBlur={formikObj.handleBlur}
                  onChange={formikObj.handleChange}
                  value={formikObj.values.phone}
                  className="form-control mb-3"
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="Phone"
                />
                <label className="mb-2 form-label" htmlFor="phone">
                  Phone
                </label>
              </div>
              {formikObj.errors.phone && formikObj.touched.phone && (
                <div className="alert alert-danger">
                  {formikObj.errors.phone}
                </div>
              )}

              {/* Password */}
              <div className="form-floating">
                <input
                  onBlur={formikObj.handleBlur}
                  onChange={formikObj.handleChange}
                  value={formikObj.values.password}
                  className="form-control mb-3"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                />
                <label className="mb-2 form-label" htmlFor="password">
                  Password
                </label>
              </div>
              {formikObj.errors.password && formikObj.touched.password && (
                <div className="alert alert-danger">
                  {formikObj.errors.password}
                </div>
              )}

              {/* Re-enter Password */}
              <div className="form-floating">
                <input
                  onBlur={formikObj.handleBlur}
                  onChange={formikObj.handleChange}
                  value={formikObj.values.rePassword}
                  className="form-control mb-3"
                  type="password"
                  name="rePassword"
                  id="rePassword"
                  placeholder="rePassword"
                />
                <label className="mb-2 form-label" htmlFor="rePassword">
                  Re-enter password
                </label>
              </div>
              {formikObj.errors.rePassword && formikObj.touched.rePassword && (
                <div className="alert alert-danger">
                  {formikObj.errors.rePassword}
                </div>
              )}

              <button
                disabled={
                  formikObj.isValid === false || formikObj.dirty === false
                }
                type="submit"
                className="btn btn-success d-flex ms-auto"
              >
                {loader ? (
                  <FallingLines
                    color="#fff"
                    width="30"
                    visible={true}
                    ariaLabel="falling-lines-loading"
                  />
                ) : (
                  "SignUp"
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </>
  );
}