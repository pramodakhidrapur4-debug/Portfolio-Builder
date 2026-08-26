import { BrowserRouter as Rou, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./Pages/Home/Home";
import PortfolioLive from "./Pages/PortfolioLive/PortfolioLive";
import Register from "./Components/Register/Register";
import TemStru from "./Components/TemStru.jsx/TemStru";
import DarkForm from "./Components/Template-forms/DarkForm";

import Dark from "./Components/Tmeplates/web/Dark/Dark";
import Light from "./Components/Tmeplates/web/Light/Light";
import Modern from "./Components/Tmeplates/web/modern/Modern";
import Login from "./Components/LOG/Login";
import Signin from "./Components/LOG/Signin";
import Otpverification from "./Components/LOG/Otpverification";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Navigate } from "react-router-dom";
import Profile from "./Components/Profile/Profile";
import LandingPage from "./Pages/LandingPage/LandingPage";
import BusinessPage from "./Components/BusinessPage/BusinessPage";
const App = () => {
const Protected=({children})=>{
const tok=localStorage.getItem("token");

if(!tok){
  return <Navigate to="/Log" replace />;
}
    return children;

}

  return (
              <GoogleOAuthProvider  clientId="374732876524-01g3p45ic9jk4qba0r8733fj70k8sa3o.apps.googleusercontent.com"  >  

    <div>
      <Rou>
        <Routes>
               <Route path="/business" element={<BusinessPage />} />

           <Route path="/" element={<LandingPage />} />
          <Route path="/ho" element={<Home />} />
          <Route path="/Register" element={<Register />} />
                    <Route path="/Dark/:id" element={<Dark /> } />
                                        <Route path="/Dark/" element={<Dark /> } />

                                      <Route path="/Light/:id" element={<Light />} />
       <Route path="/Light/" element={<Light />} />

                    <Route path="/portfolio/:id" element={<PortfolioLive />} />

                    <Route path="/Modern/:id" element={<Modern />} />
                    <Route path="/Modern/" element={<Modern />} />

                    <Route path="/DarkForm" element={<Protected><DarkForm/></Protected>} />
                                        <Route path="/Log" element={<Login />} />
                                        <Route path="/sig" element={<Signin/>} />
<Route path="/verify" element={< Otpverification/>} />

<Route path='/prof' element={<Profile/>} />

        </Routes>
      </Rou>
    </div>
    </GoogleOAuthProvider>

  );
};

export default App;
