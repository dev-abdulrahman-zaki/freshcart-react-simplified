// Import Dependencies
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { Offline } from "react-detect-offline";
// Import Context (provider only)
import AuthProvider from "./context/Authentication";
import { CartContextProvider } from "./context/CartContext";
// Import Components
import Layout from "./components/01Layout/Layout";
import SignUp from "./components/04SignUp/SignUp";
import SignIn from "./components/05SignIn/SignIn";
import ProtectedRoute from "./components/06ProtectedRoute/ProtectedRoute";
import ForgotPassword from "./components/07ForgotPassword/ForgotPassword";
import VerifyCode from "./components/08VerifyCode/VerifyCode";
import ResetPassword from "./components/09ResetPassword/ResetPassword";
import ProductDetails from "./components/15ProductDetails/ProductDetails";
import Home from "./components/16Home/Home";
import Cart from "./components/22Cart/Cart";
import Payment from "./components/23Payment/Payment";
import Orders from "./components/24Orders/Orders";

function App() {
  // React Query
  const clientQuery = new QueryClient();
  // React Router
  let routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            // <ProtectedRoute>
              <Home />
            // </ProtectedRoute>
          ),
        },
        { path: "signup", element: <SignUp /> },
        { path: "signin", element: <SignIn /> },
        {
          path: "forgotPassword",
          element: <ForgotPassword />,
        },
        {
          path: "resetPassword",
          element: <ResetPassword />,
        },
        {
          path: "verifyCode",
          element: <VerifyCode />,
        },

        {
          path: "productDetails/:id",
          element: (
            // <ProtectedRoute>
              <ProductDetails />
            // </ProtectedRoute>
          ),
        },

        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "payment",
          element: (
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          ),
        },
        {
          path: "allorders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <QueryClientProvider client={clientQuery}>
        <AuthProvider>
          <CartContextProvider>
            <RouterProvider router={routes} />
            <Toaster
              containerStyle={{
                top: 58.5,
              }}
            />
          </CartContextProvider>
        </AuthProvider>
      </QueryClientProvider>

      <Offline>
        <div className="offlineMsg bg-dark text-white p-3">
          Oops! It seems like you're currently offline
        </div>
      </Offline>
    </>
  );
}

export default App;
