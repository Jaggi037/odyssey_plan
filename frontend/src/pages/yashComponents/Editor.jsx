import React from "react";
import Sidebar from "./Sidebar";
import Box from "@mui/material/Box";
import Navbar from "../dashboard/Navbar";
import TextEditor from "../document/component/Editor";

export default function Editor() {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: "flex", justifyContent: "center"}}>
          <Sidebar />
          <TextEditor />
        </Box>
      </div>
    </>
  );
}
