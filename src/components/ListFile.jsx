import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Box, Collapse, styled } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {
  downloadFile,
  getDeviceId,
  getFile,
  getFileStructure,
  sendFile,
} from "../api/file";
import CreateFolderButton from "../components/CreateFolder";
import { FiFileText } from "react-icons/fi";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOiI2MDc3ZWEyOGRkMDIzYjNiYjNjMjUyMTkxMTA1OWVlOWYwYTljYjhkY2U3YzRiODJlYzA3NzhlMWE1MmZiY2NkIn0sImV4cCI6MTcxNDAwNTc3N30.QZIBoFEprZ7_1iPS0P6T4pYGJmfhjA3hXr6OKaly5gQ";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
}));

function DriveListView({ data, device_id, resetManually, setResetManually }) {
  const [fileStructure, setFileStructure] = useState(null);
  const [openFolders, setOpenFolders] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [path, setPath] = useState("");
  const [lastPath, setLastPath] = useState("data");
  const [selectedFolder, setSelectedFolder] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFileUpload, setSelectedFileUpload] = useState(null);
  // Hàm xử lý sự kiện chuột phải
  useEffect(() => {
    setFileStructure(data);
  }, [data]);
  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setSelectedFile(item); // lưu thông tin item vào trạng thái
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };
  function findFolderPath(data, folderName, currentPath = "") {
    // Nếu data không tồn tại hoặc không có children
    if (!data || !data.children) {
      return null;
    }

    // Duyệt qua từng phần tử trong children
    for (const item of data.children) {
      // Nếu item là thư mục và có tên là folderName
      if (item.type === "directory" && item.name === folderName) {
        // Trả về đường dẫn hiện tại kết hợp với tên của thư mục
        return `${currentPath}/${folderName}`;
      }
      // Nếu item là thư mục, tiếp tục đệ quy để tìm bên trong thư mục này
      else if (item.type === "directory") {
        const foundPath = findFolderPath(
          item,
          folderName,
          `${currentPath}/${item.name}`
        );
        // Nếu tìm thấy đường dẫn trong thư mục con, trả về kết quả
        if (foundPath) {
          return foundPath;
        }
      }
    }

    // Trường hợp không tìm thấy thư mục
    return null;
  }
  const findFilePath = (data, fileName, currentPath = "") => {
    for (const item of data) {
      const newPath =
        currentPath === "" ? item.name : `${currentPath}/${item.name}`;
      if (item.type === "file" && item.name === fileName) {
        return newPath;
      } else if (item.type === "directory") {
        const filePath = findFilePath(item.children, fileName, newPath);
        if (filePath) {
          return filePath;
        }
      }
    }
    return null;
  };

  // Hàm xử lý sự kiện click cho mỗi object
  const handleClick = (fileName) => {
    const filePath = findFilePath(fileStructure.children, fileName);
    setPath(filePath);
    if (filePath) {
      console.log("Path của file:", filePath);
    } else {
      console.log("Không tìm thấy file trong cấu trúc dữ liệu");
    }
  };

  // useEffect(() => {
  //   const splitPath = path.split("/");
  //   if (splitPath[splitPath.length - 1].length === 0) setLastPath("data");
  //   else setLastPath(splitPath[splitPath.length - 1]);
  //  // alert(splitPath[splitPath.length - 1].length);
  // }, [path]);
  const handleClose = () => {
    setContextMenu(null);
  };
  const handleUpload = () => {
    setShowUploadModal(true);
    handleClose();
  };
  const handleDownload = async () => {
    if (selectedFile) {
      const filePath = findFilePath(fileStructure.children, selectedFile.name);
      const file_path = new FormData();
      file_path.append("file_path", `/${filePath}`);
      if (filePath) {
        console.log("Path của file:", filePath);
        await getFile(
          "8dfaedcebe84dee153ef465e0a2c706c46063fa402b360bd9001d110a2a30c2f",
          file_path,
          sessionStorage.getItem("access_token")
        ).then((res) => {
          console.log(res);
          if (res) {
            const downloadUrl = `http://13.215.161.193/drive/download-file/${res.data.download_code}`;
            fetch(downloadUrl)
              .then((response) => response.blob())
              .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = selectedFile.name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              })
              .catch((error) =>
                console.error("Error downloading the file:", error)
              );
          }
        });
      }
    }
    //     .then((response) => response.blob())
    //     .then((blob) => {
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement("a");
    //       a.href = url;
    //       a.download = selectedFile.name;
    //       document.body.appendChild(a);
    //       a.click();
    //       window.URL.revokeObjectURL(url);
    //       document.body.removeChild(a);
    //     })
    //     .catch((error) => console.error("Error downloading the file:", error));
    //   handleClose();
    // }
  };

  const toggleFolder = (item) => {
    setOpenFolders((prevOpenFolders) => ({
      ...prevOpenFolders,
      [item.name]: !prevOpenFolders[item.name],
    }));
  };
  const handleFileChange = (event) => {
    setSelectedFileUpload(event.target.files[0]);
  };

  const handleSubmit = async () => {
    // Here you can implement the file upload logic
    const filePath = findFolderPath(fileStructure, selectedFile.name);
    console.log("folder: ", filePath);
    const dataReq = new FormData();
    dataReq.append("file", selectedFileUpload);
    dataReq.append("file_path", `/${filePath}/`);
    await sendFile(
      device_id,
      dataReq,
      sessionStorage.getItem("access_token")
    ).then((res) => {
      setResetManually(!resetManually);
    });
    // Close the modal after handling the upload
    setShowUploadModal(false);
  };
  const renderItem = (item) => (
    <React.Fragment>
      <StyledListItem
        button
        onClick={() =>
          item.type === "directory"
            ? toggleFolder(item)
            : handleClick(item.name)
        }
        onContextMenu={(event) => handleContextMenu(event, item)}
        onMouseEnter={() => {
          setLastPath(item.name);
        }}
        onMouseLeave={() => setLastPath("")}
      >
        <ListItemIcon>
          {item.type === "file" ? (
            <InsertDriveFileIcon />
          ) : openFolders[item.name] ? (
            <FolderOpenIcon />
          ) : (
            <FolderIcon />
          )}
        </ListItemIcon>
        <ListItemText primary={item.name} />
      </StyledListItem>

      {item.type === "directory" && (
        <Collapse in={openFolders[item.name]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children &&
              item.children.map((child) =>
                renderItem(child, `${path}/${item.name}`)
              )}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );

  return (
    <List>
      {fileStructure && (
        <>
          {renderItem(fileStructure)}
          <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleDownload}>Download</MenuItem>
            <MenuItem onClick={handleUpload}>Upload File</MenuItem>
          </Menu>
          <Dialog
            open={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Upload File</DialogTitle>
            <DialogContent>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<FiFileText />}
                >
                  Choose File
                </Button>
              </label>
              {selectedFileUpload && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <FiFileText size={24} style={{ marginRight: "10px" }} />
                  <p style={{ fontSize: "14px" }}>{selectedFileUpload.name}</p>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSubmit}>Upload</Button>
              <Button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFileUpload(null);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </List>
  );
}

function DriveList() {
  const [fileStructure, setFileStructure] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [resetManually, setResetManually] = useState(false);
  useEffect(() => {
    handleGetDeviceId();
  }, []);
  useEffect(() => {
    console.log(deviceId);
    if (deviceId) {
      setTimeout(() => handleGetFileStructure(), 10);
      handleGetFileStructure();
    }
  }, [deviceId]);

  const handleGetDeviceId = async () => {
    const response =
      "8dfaedcebe84dee153ef465e0a2c706c46063fa402b360bd9001d110a2a30c2f";
    setDeviceId(response);
  };
  // const handleGetDeviceId = async () => {
  //   const res = await getDeviceId(sessionStorage.getItem("access_token"));
  //   if (res && res.data.message === "Device set successfully")
  //     setDeviceId(res.data.device_id);
  // };
  const handleGetFileStructure = async () => {
    const response = await getFileStructure(
      "8dfaedcebe84dee153ef465e0a2c706c46063fa402b360bd9001d110a2a30c2f"
    );
    console.log(response);
    if (response.status === 200) {
      setFileStructure(response.data);
    }
  };
  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Drive</h1>
      {fileStructure ? (
        <Box>
          <DriveListView
            data={fileStructure}
            device_id={deviceId}
            resetManually={resetManually}
            setResetManually={setResetManually}
          />

          <Box sx={{ mt: "100px" }}>
            <CreateFolderButton device_id={deviceId} file_path={"test"} />
          </Box>
        </Box>
      ) : (
        <div> Loading </div>
      )}
    </div>
  );
}
export default DriveList;
