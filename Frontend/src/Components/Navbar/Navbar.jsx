import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate=useNavigate();
const [userinfo,setuserinfo]=useState(null);
const [open,setopen]=useState(false);
useEffect(()=>{
const data=localStorage.getItem('user-info')
const userdata=JSON.parse(data)
setuserinfo(userdata);
},[])

  return (
    <div>
      <div className="Nav">
        <div className="Nav-Container">
        <a href='/' >Home</a>
        <a href='#tt' >Templates</a>
        <a href='#Cont' >Book a Custom Website Consultation</a>


{

userinfo?( <div className="prop">
<div className="profilepic" onClick={()=>setopen(!open)}

  

> {userinfo.name.charAt(0).toUpperCase()}
 {userinfo.name.charAt(1).toUpperCase()}
  

                

  </div>

{open &&(
 <div className="profile-menu" >
<p onClick={() =>navigate('/prof')} >Profile</p>

<p
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user-info");
    navigate("/Log");
  }}
>
  Logout
</p>



     <p>   <a href='#Cont' >Book a Custom Website Consultation</a></p>
   </div>
)}
  

</div> ):( <button onClick={()=>navigate('/Log')} >Register/Login</button>)


}



        </div>
      </div>
    </div>

  )
}

export default Navbar
