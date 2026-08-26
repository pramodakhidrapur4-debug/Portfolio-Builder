import { BrowserRouter as Rou, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React from "react";
import Home from "./Pages/Home/Home";
import PortfolioLive from "./Pages/PortfolioLive/PortfolioLive";
import Register from "./Components/Register/Register";
import ScrollToTop from "./Components/ScrollToTop";
import TemStru from "./Components/TemStru.jsx/TemStru";
import DarkForm from "./Components/Template-forms/DarkForm";

import Dark from "./Components/Tmeplates/web/Dark/Dark";
import Light from "./Components/Tmeplates/web/Light/Light";
import Modern from "./Components/Tmeplates/web/modern/Modern";
import Login from "./Components/LOG/Login";
import Signin from "./Components/LOG/Signin";
import Otpverification from "./Components/LOG/Otpverification";
import { GoogleOAuthProvider } from "@react-oauth/google";
// Navigate imported above
import Profile from "./Components/Profile/Profile";
import LandingPage from "./Pages/LandingPage/LandingPage";
import BusinessPage from "./Components/BusinessPage/BusinessPage";
const App = () => {
const ProtectedRoute=({children})=>{
const tok=localStorage.getItem("token");
const location = useLocation();

if(!tok){
  return <Navigate to="/Log" state={{ from: location }} replace />;
}
    return children;

}

const PublicRoute=({children})=>{
const tok=localStorage.getItem("token");

if(tok){
  return <Navigate to="/ho" replace />;
}
    return children;

}

  return (
              <GoogleOAuthProvider  clientId="374732876524-01g3p45ic9jk4qba0r8733fj70k8sa3o.apps.googleusercontent.com"  >  

    <div>
      <Rou>
        <ScrollToTop />
        <Routes>
               <Route path="/business" element={<BusinessPage />} />

           <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/ho" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/Register" element={<Register />} />
                    <Route path="/Dark/:id" element={<Dark /> } />
                                        <Route path="/Dark/" element={<Dark /> } />

                                      <Route path="/Light/:id" element={<Light />} />
       <Route path="/Light/" element={<Light />} />

                    <Route path="/portfolio/:id" element={<PortfolioLive />} />

                    <Route path="/Modern/:id" element={<Modern />} />
                    <Route path="/Modern/" element={<Modern />} />

                    <Route path="/DarkForm" element={<ProtectedRoute><DarkForm/></ProtectedRoute>} />
                                        <Route path="/Log" element={<PublicRoute><Login /></PublicRoute>} />
                                        <Route path="/sig" element={<PublicRoute><Signin/></PublicRoute>} />
<Route path="/verify" element={<PublicRoute>< Otpverification/></PublicRoute>} />

<Route path='/prof' element={<ProtectedRoute><Profile/></ProtectedRoute>} />

        </Routes>
      </Rou>
    </div>
    </GoogleOAuthProvider>

  );
};

export default App;
