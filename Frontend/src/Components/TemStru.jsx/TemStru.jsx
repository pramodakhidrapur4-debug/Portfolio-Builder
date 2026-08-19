import React from 'react'
import './TemStru.css'
import {useNavigate} from  "react-router-dom"
const TemStru = () => {
const navigate=useNavigate();

  return (
    <div>
      <div className="Numtem" id='tt'>
<div className="one">
<div className="img1"></div>

<div className="discr"><b>
  A clean and simple light-themed portfolio focused on clarity and elegance. Ideal for students and professionals who prefer a minimal design that highlights content without distractions.

</b> </div>
<button onClick={()=>navigate('/DarkForm')} >use Template</button>
<button onClick={()=>navigate('/Light')} >Preview</button>
</div>


<div className="two">
<div className="img2"><img src="\" alt="" /></div>

<div className="discr"><b>    A sleek dark-themed portfolio designed for developers who want a bold and professional presence. Perfect for showcasing projects with a modern tech aesthetic and strong visual impact.

</b>

</div>
<button onClick={()=>navigate('/DarkForm')} >use Template</button>
<button onClick={()=>navigate('/Dark')} >Preview</button>
      </div>



<div className="three">
<div className="img3"></div>

<div className="discr"><b>
A vibrant and stylish portfolio template built for designers and creators. Features a modern layout with eye-catching sections to showcase creativity and personal branding.
</b></div>
<button onClick={()=>navigate('/DarkForm')}  >use Template</button>
<button onClick={()=>navigate('/Modern')}  >Preview</button>
      </div>






      </div>

    </div>
  )
}

export default TemStru
