import React from "react";
import Sidebar from "./Sidebar";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";

export default function Analytics() {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          calendar here
        </Box>
      </div>
    </>
  );
}
