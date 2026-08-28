import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiLockClosed, HiIdentification, HiEye, HiEyeOff, HiShieldCheck } from "react-icons/hi";
import { useToast } from "../UI/Toast";
import { adminLogin } from "../api";
import "./Login.css";

const Login = () => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!adminId.trim() || !password.trim()) {
      setError("Please fill in all fields");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const res = await adminLogin({ email: adminId, password });
      
      if (res.data.success) {
        sessionStorage.setItem("adminAuth", res.data.token);
        toast.success("Welcome back, Admin!");
        navigate("/dashboard", { replace: true });
      } else {
        setError(res.data.message || "Invalid Email or Password");
        triggerShake();
        toast.error("Authentication failed");
      }
    } catch (err) {
      setError("Server error during login");
      triggerShake();
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1" />
        <div className="login-bg__orb login-bg__orb--2" />
        <div className="login-bg__orb login-bg__orb--3" />
      </div>

      <div className={`login-card ${shake ? "login-card--shake" : ""}`}>
        {/* Header */}
        <div className="login-card__header">
          <div className="login-card__icon">
            <HiShieldCheck />
          </div>
          <h1>Admin Panel</h1>
          <p>AscendVia Management Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-card__form">
          <div className="login-field">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="login-field__wrapper">
              <HiIdentification className="login-field__icon" />
              <input
                id="admin-email"
                type="email"
                placeholder="Enter your Admin Email"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="admin-pass">Password</label>
            <div className="login-field__wrapper">
              <HiLockClosed className="login-field__icon" />
              <input
                id="admin-pass"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-field__toggle"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-card__footer">
          <p>Secured Admin Access • AscendVia</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
