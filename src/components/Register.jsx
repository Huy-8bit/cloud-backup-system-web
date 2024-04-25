import React, { useState } from 'react';
import '../css/Register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
     const formData = new FormData();
     formData.append("username", username);
     formData.append("password", password);
     formData.append("email",email);
     
     const requestOptions = {
       method: "POST",
       body: formData,
       redirect: "follow"
     };
     fetch("http://13.215.161.193/auth/register", requestOptions)
      .then(response => response.json())
      .then(data => {
         if (data.success) {
           alert('Registration successfully');
           navigate('/login')
         } else {
           alert('Registration failed');
         }
       })
      .catch(error => console.error(error));
    }
 

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}


export default Register;