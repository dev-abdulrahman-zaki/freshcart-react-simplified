import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { ThreeCircles } from "react-loader-spinner";
import { Link } from "react-router-dom";

export default function Orders() {
  const [userOrders, setUserOrders] = useState(null);
  useEffect(() => {
    const res = jwtDecode(localStorage.getItem("token"));
    getUserOrder(res.id);
  }, []);

  async function getUserOrder(userID) {
    try {
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${userID}`,
        {}
      );

      setUserOrders(data);
    } catch (error) {
      console.log("Error : ", error);
    }
  }

  function handleDate(dateInfo) {
    let date = new Date(dateInfo);

    var month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let ampm = null;

    if (date.getHours() >= 12) {
      ampm = "PM";
    } else {
      ampm = "AM";
    }

    let formHours = date.getHours();

    if (formHours === 0) {
      formHours = 12;
    } else if (formHours > 12) {
      formHours -= 12;
    }

    const details = {
      theDate: `${date.getDate()} ${
        month[date.getMonth()]
      }, ${date.getFullYear()}`,
      clock: `${formHours}:${
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      } ${ampm}`,
      day: dayNames[date.getDay()],
    };

    return details;
  }

  if (userOrders === null) {
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
        <title>Orders</title>
      </Helmet>
      <div className="container py-5">
        {userOrders.length > 0 ? (
          userOrders.reverse().map((order, idx) => {
            let { theDate, clock, day } = handleDate(order.createdAt);

            return (
              <div key={idx} className="order ">
                <div className="container py-3">
                  <div className="row g-4">
                    {order.cartItems.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="col-sm-6 col-md-4 col-lg-3 col-xl-2"
                        >
                          <Link to={`/productDetails/${item.product.id}`}>
                            <div
                              className="product cursor-pointer"
                              title={item.product.title}
                            >
                              <div className="p-3 ">
                                <img
                                  src={item.product.imageCover}
                                  className="w-100 mb-3"
                                  alt={item.product.title}
                                />
                                <h6 className="text-main fs-6">
                                  {item.product.category.name}
                                </h6>
                                <h6 className="textSlice fs-6">
                                  {item.product.title}
                                </h6>
                                <h6 className="fs-6 text-main ">
                                  {item.price} EGP
                                </h6>
                                <h6 className="fs-6">Count : {item.count}</h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <h5 className="fs-6">
                  <i className="fa-solid fa-angles-right fa-xs"></i> Payment
                  Method :
                  <span className="text-main "> {order.paymentMethodType}</span>
                </h5>
                <h5 className="fs-6">
                  <i className="fa-solid fa-angles-right fa-xs"></i> Total Order
                  Price :{" "}
                  <span className="text-main ">
                    {" "}
                    {order.totalOrderPrice} EGP
                  </span>
                </h5>

                <h5 className="fs-6">
                  <i className="fa-solid fa-angles-right fa-xs"></i> The Date :
                  <span className="text-main "> {theDate}</span>
                </h5>
                <h5 className="fs-6">
                  <i className="fa-solid fa-angles-right fa-xs"></i> The Hour :
                  <span className="text-main "> {clock}</span>
                </h5>
                <h5 className="fs-6">
                  <i className="fa-solid fa-angles-right fa-xs"></i> Day :
                  <span className="text-main "> {day}</span>
                </h5>
                <hr />
              </div>
            );
          })
        ) : (
          <div className="py-5 text-center">
            <h2>No Results Found</h2>
            <Link
              to="/"
              className="text-main cursor-pointer fw-semibold d-inline-block "
            >
              Add Some Products
            </Link>
          </div>
        )}

        {}
      </div>
    </>
  );
}
