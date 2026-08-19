import React from "react";
import './Home';
import Navbar from "../../Components/Navbar/Navbar";
import Header from "../../Components/Header/Header";
import { useNavigate } from "react-router-dom";
import Features from "../../Components/Features/Features";
import TemStru from "../../Components/TemStru.jsx/TemStru";
import Contact from "../../Components/Contact/Contact";
import Footer from "../../Components/Footer/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <Header />
      <Features />
      <TemStru />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
