import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { authContext } from "./Authentication.js";

export const CartContext = createContext();

export function CartContextProvider({ children }) {
  const [CartProducts, setCartProducts] = useState(null);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [cartID, setcartID] = useState(null); // cart ID: to use it in Payment Component
  const { token } = useContext(authContext);

  async function addProductToCart(productId) {
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        {
          productId: productId,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      getUserCart();

      return data;
    } catch (e) {
      console.log("Error : ", e);
    }
  }

  async function getUserCart() {
    if (localStorage.getItem("token") !== null) {
      try {
        const { data } = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/cart",
          { headers: { token: localStorage.getItem("token") } }
        );
        setNumOfCartItems(data?.numOfCartItems);
        setTotalCartPrice(data?.data?.totalCartPrice);
        setCartProducts(data?.data?.products);
        setcartID(data?.data?._id);
      } catch (e) {
        if (e.response && e.response.status === 404) {
          // Handle the case where the cart is empty and the API returns a 404 error
          console.log("Cart is empty.");
        } else {
          // Log other errors
          console.error("Error retrieving cart:", e);
        }
        setNumOfCartItems(0);
        setTotalCartPrice(0);
        setCartProducts([]);
      }
    }
  }

  async function deleteProduct(productId) {
    try {
      const { data } = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { headers: { token: localStorage.getItem("token") } }
      );

      setNumOfCartItems(data.numOfCartItems);
      setTotalCartPrice(data.data.totalCartPrice);
      setCartProducts(data.data.products);

      return data;
    } catch (error) {
      console.log("Error : ", error);
    }
  }

  async function clearCart() {
    try {
      await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart`, {
        headers: { token: localStorage.getItem("token") },
      });

      setNumOfCartItems(0);
      setTotalCartPrice(0);
      setCartProducts([]);
    } catch (error) {
      console.log("Error : ", error);
    }
  }

  async function updateProduct(productId, count) {
    try {
      const { data } = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          count: count,
        },
        { headers: { token: localStorage.getItem("token") } }
      );

      setNumOfCartItems(data.numOfCartItems);
      setTotalCartPrice(data.data.totalCartPrice);
      setCartProducts(data.data.products);

      return data;
    } catch (error) {
      console.log("Error : ", error);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      getUserCart();
    }
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        addProductToCart,
        CartProducts,
        totalCartPrice,
        numOfCartItems,
        setNumOfCartItems,
        setTotalCartPrice,
        setCartProducts,
        deleteProduct,
        updateProduct,
        clearCart,
        getUserCart,
        cartID,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
