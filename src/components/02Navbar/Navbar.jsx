import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Import Context (cretead only)
import { authContext } from "../../context/Authentication";
import { CartContext } from "../../context/CartContext";


export default function Navbar() {
  const { token, setToken } = useContext(authContext);
  const { numOfCartItems } = useContext(CartContext);
  const nav = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    nav("/signin");
  }


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <NavLink
            className="navbar-brand active"
            to="/"
            id="logo"
          >
            Store
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
              {token && (
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/allorders"
                      id="orders"
               
                    >
                      Orders
                    </NavLink>
                  </li>
              )}
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              {token ? (
                <>
                  <li className="nav-item me-lg-2" title="Cart">
                    <NavLink
                      className="shopCart nav-link position-relative"
                      to="/cart"
                      id="cart"                 
                    >
                      <i className="fa-solid fa-cart-shopping text-dark"></i>
                      <span className="position-absolute translate-middle badge rounded-2 bg-main">
                        {numOfCartItems}
                      </span>
                    </NavLink>
                  </li>

                  <li className="nav-item ">
                    <span
                      onClick={logout}
                      style={{ cursor: "pointer" }}
                      className="nav-link"
                    >
                      SignOut
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link "
                      aria-current="page"
                      to="/signup"
                      id="signup"
                
                    >
                      SignUp
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/signin"
                      id="signin"
                
                    >
                      SignIn
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
