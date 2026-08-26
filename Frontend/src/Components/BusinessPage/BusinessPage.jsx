import React, { useState } from "react";
import "./BusinessPage.css";
import OurPrevWork from "../OurPrevWork/OurPrevWork";

import { createBusinessEnquiry } from "../api";

const BusinessPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const handlSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.businessName || !form.message) {
      alert("Please fill out all fields.");
      return;
    }
    
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await createBusinessEnquiry(form);
      if (res.data.success) {
        setStatusMsg({ type: "success", text: "Enquiry submitted successfully! We will contact you soon." });
        setForm({ name: "", email: "", phone: "", businessName: "", message: "" });
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setStatusMsg({ type: "error", text: error.response?.data?.message || "Failed to submit enquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="business">
    <h1>Custom Websites Built for Your Business</h1>

<p>
  We build customized websites based on your business requirements and goals.
  Get a unique, modern, and professional website designed specifically for you.
</p>
        
      </div>
      <div className="busi">
        <form onSubmit={handlSubmit}>
        <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter your name"
      />

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />

      <input
        type="text"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Enter your phone number"
      />

      <input
        type="text"
        name="businessName"
        value={form.businessName}
        onChange={handleChange}
        placeholder="Enter business name"
      />

      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Enter your message"
      />

      <div className="byy">
        <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
      {statusMsg && (
        <div style={{ marginTop: '15px', padding: '10px', borderRadius: '5px', textAlign: 'center', backgroundColor: statusMsg.type === 'success' ? '#d4edda' : '#f8d7da', color: statusMsg.type === 'success' ? '#155724' : '#721c24' }}>
          {statusMsg.text}
        </div>
      )}
        </form>
      </div>

            <OurPrevWork/>

    </div>
  );
};

export default BusinessPage;