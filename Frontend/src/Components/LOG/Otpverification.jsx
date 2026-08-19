import React, { useState } from 'react';
import './Otpverification.css';
import { verifyOtp } from '../api';
import { useNavigate } from 'react-router-dom';
import { ButtonSpinner } from '../Loader/Loader';

const Otpverification = () => {
  const navigate = useNavigate();
  const [otp, setotp] = useState("");
  const [email, setemail] = useState("");
  const [loding, setloding] = useState(false);

  const ve = async () => {
    if (!email || !otp) {
      alert("Please enter both email and OTP.");
      return;
    }
    setloding(true);
    try {
      const res = await verifyOtp({
        email,
        otp
      });

      if (res.data && res.data.success) {
        alert("OTP Verified Successfully!");
        const token = res.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user-info",
          JSON.stringify({
            name: res.data.name,
            email: res.data.email,
          })
        );
        navigate('/');
      } else {
        alert(res.data?.message || "Invalid OTP code");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Verification failed. Please try again.");
    } finally {
      setloding(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        
        <div className="otp-left">
          <div className="otp-brand">Portfolio Builder</div>
          <h1>Verify your account</h1>
          <p>
            We’ve sent a one-time password to your email.
            Enter your email and OTP below to continue.
          </p>
        </div>

        <div className="otp-right">
          <div className="otp-card">
            <h2>OTP Verification</h2>
            <p className="otp-note">Enter your details to verify your account</p>

            <div className="otp-field">
              <label>Enter Email</label>
              <input
                type="email"
                placeholder='Enter registered email'
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />

              <label>OTP Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setotp(e.target.value)}
              />
            </div>

            <button className="otp-btn" onClick={ve} disabled={loding}>
              {loding ? <ButtonSpinner label="Verifying OTP..." /> : "Verify OTP"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Otpverification;