import React, { useState } from 'react';
import './Contact.css';
import { paymeverifi, order, paykey } from '../api';
import { PageOverlayLoader, ButtonSpinner } from '../Loader/Loader';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const paymhan = async (amount) => {
    setLoadingMsg(`Processing Consultation Payment (₹${amount})...`);
    setLoading(true);
    try {
      const keyy = await paykey();
      const orderr = await order({ amount });

      const options = {
        key: keyy.data.key,
        amount: orderr.data.amount,
        currency: orderr.data.currency,
        name: 'AscendVia',
        description: `Website Consultation (₹${amount})`,
        order_id: orderr.data.id,
        handler: async function (response) {
          try {
            setLoadingMsg("Verifying Payment...");
            setLoading(true);
            const verify = await paymeverifi(response);

            if (verify.data && verify.data.success) {
              alert("Payment Verified & Consultation Booked Successfully!");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Payment Verification Error:", err);
            alert("Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#6366f1'
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Razorpay Order Error:", error);
      alert("Could not initialize payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className='Con' id='Cont'>
      {loading && <PageOverlayLoader message={loadingMsg} />}

      <div className="tit">
        <h1>Book a Custom Website Consultation</h1>
      </div>

      <div className="info">
        <div className="info1">
          <p>✅ 15–20 Minute Consultation</p> 
          <p>✅ Requirement Discussion</p>
          <p>✅ Basic Website Planning</p> 
          <p>✅ Portfolio Improvement Suggestions</p> 
          <p>✅ Basic UI/UX Advice</p> 
          <p>✅ Approximate Project Cost</p> 
          <p>✅ WhatsApp Support for 3 Days</p> 
          <p>✅ Resume Review</p> 

          <button onClick={() => paymhan(49)} disabled={loading}>
            {loading ? (
              <ButtonSpinner label="Processing..." />
            ) : (
              <h3>Book a Custom Website Consultation just paying ₹49</h3>
            )}
          </button>
        </div>

        <div className="info2">
          <p>✅ 30–45 Minute One-to-One Consultation</p>
          <p>✅ Detailed Requirement Analysis</p> 
          <p>✅ Custom UI/UX Suggestions</p> 
          <p>✅ Website Feature Planning</p> 
          <p>✅ Personal Branding Guidance</p> 
          <p>✅ Interview Portfolio Guidance</p> 
          <p>✅ Portfolio Presentation Practice</p> 
          <p>✅ Priority Support</p>
          <p>✅ Final Development Roadmap</p>
          <p>✅ Accurate Project Quotation</p> 
          <p>✅ Resume Review</p> 

          <button onClick={() => paymhan(99)} disabled={loading}>
            {loading ? (
              <ButtonSpinner label="Processing..." />
            ) : (
              <h3>Book a Custom Website Consultation just paying ₹99</h3>
            )}
          </button>
        </div>
      </div>

      <div className="stti">
        <h2>🚀 What Happens After You Book?</h2>
      </div>

      <div className="steps">
        <p>📅 Book Consultation (₹49 / ₹99)</p>  
        <p>💬 Requirement Discussion</p> 
        <p>📋 Planning & Final Project Quote</p>
        <p>💳 50% Advance Payment</p>
        <p>🎨 Design Approval</p>
        <p>💻 Website Development</p>
        <p>🧪 Testing & Client Review</p>
        <p>💰 Remaining 50% Payment</p>
        <p>🚀 Website Delivery</p>
        <p>📂 Source Code & Full Ownership Handover</p>
        <p>🎓 Interview & Portfolio Guidance</p>
      </div>
    </div>
  );
};

export default Contact;
