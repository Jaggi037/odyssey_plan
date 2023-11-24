import React from "react";
import Sidebar from "./Sidebar";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";

export default function Templates() {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: "flex" }}>
          <Sidebar />

          templates here
        </Box>
      </div>
    </>
  );
}
