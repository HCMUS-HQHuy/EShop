import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Header from "../components/Header";
import apiClient from "utils/axios";

const Register = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const history = useHistory();

  // 1. Cải tiến State: Dùng một object để lưu lỗi cho từng trường
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Hàm helper để cập nhật form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Xóa lỗi cũ mỗi khi submit lại
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match!" });
      return;
    }

    setLoading(true);

    try {
      const { data } = await apiClient.post(
        '/auth/register',
        { 
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }
      );
      setLoading(false);

      if (data.error === true) {
        const errorData = data.data[0];
        const newErrors = {};
        if (errorData.username) {
          newErrors.username = errorData.username;
        }
        if (errorData.email) {
          newErrors.email = errorData.email;
        }
        setErrors(newErrors);
        console.log(errorData);
        return;
      }
      history.push("/login");
    } catch (err) {
      setLoading(false);

      // 2. Cải tiến Logic `catch` để đọc cấu trúc lỗi mới
      if (err.response && err.response.data.error === true) {
        // Nếu backend trả về lỗi_đã_biết (username/email tồn tại)
        const errorData = err.response.data.data[0];
        const newErrors = {};
        if (errorData.username) {
          newErrors.username = errorData.username;
        }
        if (errorData.email) {
          newErrors.email = errorData.email;
        }
        setErrors(newErrors);
      } else {
        // Nếu là lỗi khác (lỗi mạng, lỗi server 500...)
        const message = err.response && err.response.data.message
          ? err.response.data.message
          : "An unexpected error occurred.";
        setErrors({ form: message }); // Gán lỗi vào một key chung là 'form'
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
        <form className="Login col-md-8 col-lg-4 col-11" onSubmit={submitHandler}>
          {/* Hiển thị lỗi chung của form (nếu có) */}
          {errors.form && <div className="alert alert-danger">{errors.form}</div>}
          {loading && <div className="alert alert-info">Loading...</div>}

          {/* 3. Cải tiến JSX để hiển thị lỗi ngay dưới mỗi input */}
          <input
            type="text"
            placeholder="Username"
            name="username" // Thêm `name` để `handleInputChange` hoạt động
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