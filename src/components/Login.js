// App.js
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [setVerificationSent] = useState(false);
  const [setResetSent] = useState(false);
  const [email, setEmail] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openVerificationDialog, setOpenVerificationDialog] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // State for new password input
  const navigate = useNavigate()
  const handleReset = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    // Send a POST request to the API endpoint with the user email
    fetch("http://13.215.161.193/auth/request-password-reset", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Password reset email sent") {
          setNewPassword("");
          setPassword("");
          setResetSent(true);
          setOpenDialog(false); // Close the dialog after sending reset request
          setOpenVerificationDialog(true); // Open verification dialog after sending reset request
        } else {
          setEmail("");
          setUsername("");
          setPassword("");
          alert("Reset failed");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const token = sessionStorage.getItem("access_token");
    // Send a POST request to the API endpoint with the user data
    fetch(`http://13.215.161.193/auth/login`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.access_token);
        if (data.access_token) {
          if (data.needsVerification) {
            setVerificationSent(true);
          } else {
            setUsername("");
            setPassword("");
            alert("dang nhap thanh cong");
            sessionStorage.setItem("access_token", data.access_token);
            sessionStorage.setItem("user_id", data.id);
            navigate('/')
            // Redirect to another page or perform some action
          }
        } else {
          setUsername("");
          setPassword("");
          alert("Login failed");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setOpenDialog(false);
  };

  const handleVerificationClose = () => {
    setVerificationCode("");
    setOpenVerificationDialog(false);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Construct the request body
    const requestBody = {
      email,
      verification_code: verificationCode,
      new_password: newPassword,
    };

    // Send a POST request to the API endpoint with the reset password data
    fetch("http://13.215.161.193/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Reset successful
          alert("Password reset successful");
          setVerificationCode(""); // Clear verification code input
          setNewPassword(""); // Clear new password input
          setOpenVerificationDialog(false); // Close verification dialog after password reset
        } else {
          // Reset failed
          alert("Password reset failed");
        }
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        alert("An error occurred while resetting password");
      });
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
        <Button variant="outlined" onClick={handleOpenDialog}>
          Forgot Password
        </Button>
        <Link to="/register">
          <Button variant="outlined">Sign Up</Button>
        </Link>
        {/* Add Sign Up button */}
      </form>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleReset}>Reset Password</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openVerificationDialog} onClose={handleVerificationClose}>
        <DialogTitle>Enter Verification Code and New Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handleResetPassword}>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="email"
              type="text"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              autoFocus
              margin="dense"
              id="verificationCode"
              label="Verification Code"
              type="text"
              fullWidth
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="newPassword"
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVerificationClose}>Cancel</Button>
          <Button type="submit" onClick={handleResetPassword}>
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Login;
