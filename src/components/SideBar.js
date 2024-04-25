import React, { useState } from 'react';
import drive from "../pics/myDrive.png";
import "../css/SideBar.css";
import DeviceDialog from './DeviceDialog';  // Đảm bảo đường dẫn đến file là đúng
import Button from '@mui/material/Button';

export default function SideBar() {
  const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
  return (
    <>
      <div id="sideBar">
      <div>
            <Button variant="outlined" onClick={handleClickOpen}>
              New Device
            </Button>
            <DeviceDialog open={open} handleClose={handleClose} />
        </div>

        <div id="sideBarOpt">
          <div className="sideBarOptions">
            <img src={drive} alt="Reload page" className="opacity" />
            <h3>My drive</h3>
          </div>             

          
          
        </div>     

        

          
        </div>

        
    
    </>
  );
}
