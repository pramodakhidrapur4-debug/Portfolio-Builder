import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { googleauth, log } from '../api.js';
import { PageOverlayLoader, ButtonSpinner } from '../Loader/Loader';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/ho";

  const [form, setform] = useState({
    email: "",
    passw: "",
  });
  const [loding, setloding] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const lo = async () => {
    if (!form.email || !form.passw) {
      alert("Please enter both email and password.");
      return;
    }
    try {
      setloding(true);
      const res = await log({
        email: form.email,
        password: form.passw
      });

      if (res.data && res.data.success) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user-info",
          JSON.stringify({
            name: res.data.name,
            email: res.data.email,
          })
        );
        navigate(from, { replace: true });
      } else {
        alert(res.data?.message || "Login failed. Please check credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setloding(false);
    }
  };

  const hanfom = (e) => {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  };

  const resGoogle = async (resp) => {
    try {
      setGoogleLoading(true);
      if (resp['code']) {
        const result = await googleauth(resp['code']);
        if (result.data && result.data.success) {
          const token = result.data.token;
          localStorage.setItem('token', token);

          const { email, name, picture } = result.data.user;
          const obj = { email, name, picture, token };
          localStorage.setItem('user-info', JSON.stringify(obj));

          navigate(from, { replace: true });
        } else {
          alert("Google Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      if (error.code === 'ECONNABORTED') {
        alert("Server is starting up. This may take up to a minute, please try again.");
      } else {
        alert("Google login error. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
      setIsPopupOpen(false);
    }
  };

  const goolelog = useGoogleLogin({
    onSuccess: resGoogle,
    onError: (error) => {
      console.error(error);
      setGoogleLoading(false);
      setIsPopupOpen(false);
    },
    onNonOAuthError: () => {
      setIsPopupOpen(false);
    },
    flow: 'auth-code'
  });

  const handleGoogleClick = () => {
    setIsPopupOpen(true);
    goolelog();
  };

  return (
    <div className="alon">
      {googleLoading && <PageOverlayLoader message="Authenticating with Google..." />}

      <div className='log'>
        <div className="login">
          Email
          <input
            type="text"
            placeholder='Enter your email address'
            onChange={hanfom}
            name='email'
            value={form.email}
          />
          
          Password
          <input
            type="password"
            placeholder='Enter your password'
            onChange={hanfom}
            name='passw'
            value={form.passw}
          />

          <button className="bbtn" onClick={lo} disabled={loding || googleLoading || isPopupOpen}>
            {loding ? <ButtonSpinner label="Signing In..." /> : "Login"}
          </button>

          <div className='or'>
            <hr /> <label>or</label> <hr />
          </div>

          <div className="gog">
            <button onClick={handleGoogleClick} disabled={loding || googleLoading || isPopupOpen}>
              <FcGoogle size={22} style={{ margin: "8px" }} />
              {googleLoading || isPopupOpen ? "Connecting..." : "Continue with Google"}
            </button>
          </div>

          <div className="sig-link" onClick={() => navigate('/sig', { state: { from: location.state?.from } })}>
            Don't have an account? Sign In
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
