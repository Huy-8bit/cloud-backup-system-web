import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

function DeviceDialog({ open, handleClose }) {
    const [deviceName, setDeviceName] = useState('');
    const handleSubmit = () => {
      const url = 'http://54.254.58.42/drive/setDevice';
      const data = { name: deviceName };
      const user_token = sessionStorage.getItem("access_token");
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_token}` // Corrected to use template literals correctly
      };
  
      fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
            sessionStorage.setItem("device_id", data.device_id);
          console.log('Success:', data);
          handleClose();  // Close the dialog on success
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  };
  

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Set Device Name</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To add a new device, please enter the name of the device here.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Device Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeviceDialog;
