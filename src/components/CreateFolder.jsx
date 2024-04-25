import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { createFolder } from '../api/file';
const CreateFolderForm = ({ open, handleClose, device_id, file_path }) => {
  const [folderName, setFolderName] = useState('');

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleCreateFolder = async () => {
    // Gọi API tạo thư mục mới ở đây, sử dụng folderName
    // Sau khi tạo thư mục, bạn có thể xử lý các thao tác cần thiết ở đây
    const newFilePath = `/${folderName}`
    await createFolder(device_id,newFilePath,sessionStorage.getItem("access_token"))
    handleClose(); // Đóng form sau khi tạo xong
    setFolderName('')
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Tạo Thư Mục Mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên Thư Mục"
          type="text"
          fullWidth
          value={folderName}
          onChange={handleFolderNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button  onClick={() => {
            handleClose();
            setFolderName("");
          }} color="primary">
          Hủy
        </Button>
        <Button onClick={handleCreateFolder} color="primary">
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CreateFolderButton = ({device_id, file_path}) => {
    const [open, setOpen] = useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            padding:'20px',
            fontWeight: 'bold',
            fontSize: '16px',
            borderRadius: '25px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#2da44e',
            },
          }}
        >
          New Folder
        </Button>
        <CreateFolderForm open={open} handleClose={handleClose} device_id={device_id} file_path={file_path} />
      </div>
    );
  };
  

export default CreateFolderButton;
