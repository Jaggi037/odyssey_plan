import { useState  } from "react";
import { IconButton , Menu } from "@mui/material";

const popupAnchor = {
    vertical: 'top', 
    horizontal: 'left',
}

const popupTransform = {
    vertical: 'bottom', 
    horizontal: 'left',
}

const dropdownTransform  = {
    vertical: 'top', 
    horizontal: 'left',
}

const dropdownAnchor = {
    vertical: 'bottom', 
    horizontal: 'center',
}

export default function DropdownMenu({ popUp , icon , children , setAnchorEl , anchorEl}) {
  
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
        <IconButton
          aria-controls="dropdown-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
         {icon}
        </IconButton>
        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          keepMounted
          anchorOrigin={popUp ? popupAnchor : dropdownAnchor}
          transformOrigin={popUp ? popupTransform : dropdownTransform}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
            {
                children
            }
            
        </Menu>
      </div>
    );
}