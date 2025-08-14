import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Header from "../components/Header";
import apiClient from "utils/axios";

const Register = () => {
  const history = useHistory();

  // 1. Kiểm tra nếu người dùng đã đăng nhập thì điều hướng về trang chủ
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      history.push("/");
    }
    window.scrollTo(0, 0);
  }, [history]);

  // 2. Thêm `fullname` vào state của form
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match!" });
      return;
    }

    setLoading(true);

    try {
      const { data } = await apiClient.post(
        '/auth/register', // Đảm bảo URL là chính xác
        { 
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }
      );
      console.log("Registration successful:", data);
      setLoading(false);
      history.push("/login");

    } catch (err) {
      console.error("Registration error:", err);
      setLoading(false);
      const errorData = err.response.data.data[0] || {};
      console.log(errorData);
      setErrors('form an error occurred during registration.');
    }
  };

  return (
    <>
      <Header />
      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
        <form className="Login col-md-8 col-lg-4 col-11" onSubmit={submitHandler}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2>Create Account</h2>
          </div>
          
          {errors.form && <div className="alert alert-danger">{errors.form}</div>}
          {loading && <div className="alert alert-info">Registering...</div>}

          {errors.fullname && <p className="text-danger small">{errors.fullname}</p>}

          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {errors.username && <p className="text-danger small">{errors.username}</p>}

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <p className="text-danger small">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          {errors.confirmPassword && <p className="text-danger small">{errors.confirmPassword}</p>}

          <button type="submit" disabled={loading}>
            Register
          </button>
          
          <p>
            <Link to={"/login"}>
              I Have An Account <strong>Login</strong>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;