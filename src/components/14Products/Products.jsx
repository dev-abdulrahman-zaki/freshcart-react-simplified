import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

export default function Products() {
  const location = useLocation();
  const [productsList, setProductsList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const { addProductToCart } = useContext(CartContext);
  const [listToDisplay, setListToDisplay] = useState(
    searchKeyword.length ? searchList : productsList
  );

  async function getAllProducts(page = 1) {
    try {
      window.scrollTo(0, 0);
      setPageLoading(true);
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/products?page=${page}`
      );
      setProductsList(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setPageLoading(false);
    }
  }

  function pagination(newPageNum) {
    // Only update if the page number actually changes
    if (newPageNum !== pageNum) {
      // reset search
      setSearchList([]);
      setSearchKeyword("");
      // set loading
      setPageLoading(true);
      // set page number
      setPageNum(newPageNum);
      // get all products
      getAllProducts(newPageNum);
    }
  }

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    setListToDisplay(searchKeyword.length ? searchList : productsList);
  }, [productsList, searchList]);

  async function handleAddToCart(productID) {
    if (localStorage.getItem("token") !== null) {
      const res = await addProductToCart(productID);
      try {
        toast.success(res.message);
      } catch (e) {
        toast.error("An error occurred while adding the product");
      }
    } else {
      toast.error("Please login to add product to cart");
    }
  }

  function handleSearchField(e) {
    setSearchKeyword(e.target.value);
    let searchMatched = productsList.filter((product) => {
      return product.title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setSearchList(searchMatched);
  }

  if (productsList.length === 0 || pageLoading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
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
      {location.pathname === "/" ? (
        <Helmet>
          <title>Home</title>
        </Helmet>
      ) : (
        <Helmet>
          <title>Products</title>
        </Helmet>
      )}

      <div className="container py-5">
        <div className="row g-4">
          {/* Start Search */}
          <div>
            <input
              type="text"
              placeholder="Search By Name ..."
              className="form-control"
              id="searchField"
              onInput={(e) => handleSearchField(e)}
            />
            {searchKeyword.length > 0 && searchList.length > 0 && (
              <span className="d-inline-block text-end w-100 py-2">
                {searchList.length} results for "
                <span className="text-primary fw-semibold">
                  {searchKeyword}
                </span>
                "
              </span>
            )}
          </div>
          {/* End Search */}

          {/* Products */}
          {listToDisplay.length > 0 ? (
            listToDisplay.map((product, idx) => {
              return (
                <div className=" col-sm-6 col-md-4 col-lg-3 col-xl-2" key={idx}>

                  
                  <div className="product p-2 cursor-pointer ">
                    <Link
                      to={`/productDetails/${product.id}`}
                      title={product.title}
                    >
                      <img
                        loading="lazy"
                        src={product.imageCover}
                        className="w-100"
                        alt="product"
                      />
                      <small className="my-2 text-main">
                        {product.category.name}
                      </small>
                      <h6 className="mb-2 mt-1 fw-semibold textSlice">
                        {product.title}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center">
                        {/* <p className="mb-1">{product.price} EGP</p> */}

                        {product.priceAfterDiscount ? (
                          <div className="d-flex align-items-center price-wrapper">
                            <p className="mb-1 product-old-price small text-decoration-line-through text-muted">
                              {product.price}
                            </p>
                            <p className="mb-1 product-price">
                              {product.priceAfterDiscount} EGP
                            </p>
                          </div>
                        ) : (
                          <p className="mb-1 product-price">
                            {product.price} EGP
                          </p>
                        )}

                        <p className="mb-1 product-rating">
                          <i className="fa-solid fa-star rating-color"></i>
                          <small>{product.ratingsAverage}</small>
                        </p>
                      </div>
                    </Link>

                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        type="button"
                        className="btn btnHover bg-main w-75 text-white mt-1 addCartBtn"
                      >
                        Add To Cart
                      </button>
                    </div>



                  </div>
                </div>
              );
            })
          ) : (
            <div>
              <h2 className="text-center py-5 alert alert-danger">
                No results!
              </h2>
            </div>
          )}
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation example">
          <ul className="pagination d-flex justify-content-center pt-4">
            <li className="page-item cursor-pointer pageParent">
              <span
                className={`page-link ${pageNum === 1 ? "pageActive" : ""}`}
                onClick={() => pagination(1)}
              >
                1
              </span>
            </li>
            <li className="page-item cursor-pointer pageParent">
              <span
                className={`page-link ${pageNum === 2 ? "pageActive" : ""} `}
                onClick={() => pagination(2)}
              >
                2
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
