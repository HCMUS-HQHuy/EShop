import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "components/Header";
import apiClient from "utils/axios";

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      alert("Already logged in");
      history.push("/");
      return;
    }
    console.log("Logging in with:", { username, password });
    console.log('env:', process.env.REACT_APP_API_URL);
    try {
      const response = await apiClient.post(`/auth/login`, {
        username: username, 
        password: password 
      });
      const dataResponse = response.data;
      if (dataResponse.error === true) {
        setError('Login failed');
        return;
      }
      console.log(dataResponse);
      localStorage.setItem('token', dataResponse.token);
      history.push('/');
    } catch (error) {
      setError(error.response.data.message || 'Login failed');
    }
  };

  return (
    <>
      <Header />
      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
        <form className="Login col-md-8 col-lg-4 col-11">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px",
              gap: "12px",
            }}
          >
            <img
              alt="logo"
              src="/images/logo.png"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "8px",
                fontSize: "24px",
              }}
            >
              Login Info
            </div>
          </div>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <span
              className="text-danger"
              style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                marginTop: "12px",
              }}
            >
              {error}
            </span>
          )}

          <button type="submit" onClick={handleLogin}>
            Login
          </button>
          <p>
            <Link to={"/register"}>
              I Don't Have Account <strong>Register</strong>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
