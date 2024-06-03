import { createContext, useEffect, useState } from "react";

// 1- create context, export it
export const authContext = createContext();

// 2- provide context, export it
export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      setToken(localStorage.getItem("token"));
    }
  }, [token]);

  return (
    // to provide what i created
    <authContext.Provider value={{ token, setToken }}>
      {children}
    </authContext.Provider>
  );
}
