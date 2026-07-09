import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function Navbar() {

  const [dark,setDark]=useState(false);

  useEffect(()=>{

    document.body.className=dark?"dark":"";

  },[dark]);

  return(

<nav className="navbar">

<h2>AI Cover Letter Generator</h2>

<button
className="themeBtn"
onClick={()=>setDark(!dark)}
>

{dark?<FaSun/>:<FaMoon/>}

</button>

</nav>

  )

}

export default Navbar;