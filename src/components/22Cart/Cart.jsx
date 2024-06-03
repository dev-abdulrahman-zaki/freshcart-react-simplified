import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { ThreeCircles } from "react-loader-spinner";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Cart() {
  const {
    CartProducts,
    totalCartPrice,
    numOfCartItems,
    deleteProduct,
    updateProduct,
    clearCart,
  } = useContext(CartContext);
  const nav = useNavigate();

  async function delProduct(productId) {
    const res = await deleteProduct(productId);
    if (res?.status === "success") {
      toast.success("Product Deleted Successfully");
    } else {
      toast.error("Error Occurred");
    }
  }

  async function updateProductCount(id, count) {
    if (count < 1) return;
    const res = await updateProduct(id, count);
    if (res?.status === "success") {
      toast.success("Product Updated Successfully");
    } else {
      toast.error("Error Occurred");
    }
  }

  async function clearCartData() {
    await clearCart();
  }

  function navigatePayment() {
    nav("/payment");
  }

  if (CartProducts === null) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 vh-100">
        <ThreeCircles
          height="70"
          width="70"
          color="#565656"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="three-circles-rotating"
          outerCircleColor=""
          innerCircleColor=""
          middleCircleColor=""
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <div className="container py-3 cartRow">
        <div className="bg-main-light p-4 rounded-4">
          <h2>Shop Cart</h2>
          {CartProducts.length ? (
            <>
              <div className="d-flex justify-content-between align-items-center py-3">
                <div>
                  <h5 className="text-main mb-3">
                    Total cart Price : {totalCartPrice} EGP
                  </h5>
                  <h6 className="text-main m-0">
                    Number Of Cart Items : {numOfCartItems}
                  </h6>
                </div>

                <div className="d-flex flex-column justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={clearCartData}
                  >
                    Clear cart
                  </button>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={navigatePayment}
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>

              {CartProducts.map((product, idx) => {
                return (
                  <div key={idx} className="row g-4 align-items-center py-3 ">
                    <div className="col-sm-3 col-md-2 col-lg-2 col-xl-1">
                      <div>
                        <Link to={`/productDetails/${product.product.id}`}>
                          <img
                            src={product.product.imageCover}
                            className="w-100"
                            alt=""
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-7 col-lg-8 col-xl-9">
                      <div>
                        <h5 className="">{product.product.title}</h5>

                        {product.priceAfterDiscount ? (
                          <span className="text-main fs-5 d-inline-block mb-2">
                            Price : {product.priceAfterDiscount} EGP
                          </span>
                        ) : (
                          <span className="text-main fs-5 d-inline-block mb-2">
                            Price : {product.price} EGP
                          </span>
                        )}

                        <button
                          onClick={() => delProduct(product.product.id)}
                          type="button"
                          className="btn btn-sm btn-outline-danger d-block"
                        >
                          <i className="fa-solid fa-trash-can "></i> Remove
                        </button>
                      </div>
                    </div>
                    <div className="col-sm-3 col-md-3 col-lg-2 col-xl-2 ">
                      <div className="d-flex align-items-center justify-content-center">
                        <button
                          onClick={() =>
                            updateProductCount(
                              product.product.id,
                              product.count + 1
                            )
                          }
                          type="button"
                          className="btn btn-sm btn-outline-success"
                        >
                          +
                        </button>
                        <span className="mx-2">{product.count}</span>
                        <button
                          onClick={() =>
                            updateProductCount(
                              product.product.id,
                              product.count - 1
                            )
                          }
                          type="button"
                          className="btn btn-sm btn-outline-success"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="py-5 text-center">
              <h4>Cart Is Empty</h4>
              <Link
                to="/"
                className="text-main cursor-pointer fw-semibold d-inline-block "
              >
                Add Some Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
