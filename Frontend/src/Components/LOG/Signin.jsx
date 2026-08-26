import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import './sign.css';
import { googleauth, signin } from '../api.js';
import { PageOverlayLoader, ButtonSpinner } from '../Loader/Loader';

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/ho";

  const [form, setform] = useState({
    name: "",
    email: "",
    contact: "",
    enterotp: "",
    passww: "",
  });
  const [loding, setloding] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const logg = async (out) => {
    try {
      setGoogleLoading(true);
      if (out['code']) {
        const res = await googleauth(out['code']);
        if (res.data && res.data.success) {
          const { name, email, picture } = res.data.user;
          const token = res.data.token;
          const obj = { email, name, picture, token };
          localStorage.setItem('token', token);
          localStorage.setItem('user-info', JSON.stringify(obj));
          navigate(from, { replace: true });
        } else {
          alert("Google Sign In failed");
        }
      }
    } catch (error) {
      console.error("Sign in page error:", error);
      alert("Google sign in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const goog = useGoogleLogin({
    onSuccess: logg,
    onError: (error) => {
      console.error(error);
      setGoogleLoading(false);
    },
    flow: 'auth-code'
  });

  const fomhan = (e) => {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  };

  const si = async () => {
    if (!form.name || !form.email || !form.passww) {
      alert("Please fill in required fields (Name, Email, Password)");
      return;
    }
    try {
      setloding(true);
      const res = await signin({
        name: form.name,
        email: form.email,
        contact_no: form.contact,
        otp: form.enterotp,
        password: form.passww,
      });

      if (res.data && res.data.success) {
        alert(res.data.message);
        navigate('/verify', { state: { from: location.state?.from } });
      } else {
        alert(res.data?.message || "Sign in failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Error creating account. Please try again.");
    } finally {
      setloding(false);
    }
  };

  return (
    <div className='sig'>
      {googleLoading && <PageOverlayLoader message="Connecting with Google..." />}

      <div className="sigin">
        Name
        <input
          type="text"
          placeholder='Enter your full name'
          onChange={fomhan}
          name='name'
          value={form.name}
        />
        
        Email
        <input
          type="email"
          placeholder='Enter your email address'
          onChange={fomhan}
          name='email'
          value={form.email}
        />
        
        Contact No
        <input
          type="text"
          placeholder='Enter phone number'
          onChange={fomhan}
          name='contact'
          value={form.contact}
        />

        Password
        <input
          type="password"
          placeholder='Create a password'
          onChange={fomhan}
          value={form.passww}
          name='passww'
        />

        <button className='bbtnn' onClick={si} disabled={loding || googleLoading}>
          {loding ? <ButtonSpinner label="Signing Up..." /> : "Sign Up"}
        </button>

        <div className="ss">
          <label>or</label>
        </div>

        <button onClick={goog} disabled={loding || googleLoading}>
          <FcGoogle size={22} />
          {googleLoading ? "Connecting..." : "Sign in with Google"}
        </button>

        <div className="signn" onClick={() => navigate('/Log', { state: { from: location.state?.from } })}>
          Already have an account? LOGIN
        </div>
      </div>  
    </div>
  );
};

export default Signin;