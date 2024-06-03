import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../02Navbar/Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="mainHeight">
        <Outlet />
      </div>
    </>
  );
}
