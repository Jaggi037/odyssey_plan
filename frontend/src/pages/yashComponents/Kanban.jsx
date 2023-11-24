import React from "react";
import Sidebar from "./Sidebar";
import Box from "@mui/material/Box";
import Navbar from "../dashboard/Navbar";

export default function Kanban() {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          kanban here
        </Box>
      </div>
    </>
  );
}
