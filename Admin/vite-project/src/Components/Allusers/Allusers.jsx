import { allu } from "../api"
import { useState,useEffect } from "react";


const Allusers=()=>{
const [User,setUser]=useState([]);
const all=async()=>{
    const d=await allu();
    if(d.data.success){
        setUser(d.data.users);
    }

} 
useEffect(() => {
    all();
}, [])



return(
<div>
{User.map((item)=>(

    <div key={item._id}>
<p>{item.name}</p>
<p>{item.email}</p>


    </div>
))}


</div>

);

    }

    export default Allusers;