import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { userData } from "../data/Products";
import Header from "../components/Header";
const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      alert("Already logged in");
      history.push("/");
      return;
    }

    const foundUser = userData.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      history.push("/");
    } else {
      setError("Invalid email or password");
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
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        </form>
      </div>
    </>
  );
};

export default Login;
