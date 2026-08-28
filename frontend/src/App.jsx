import MissingPerson from "./pages/MissingPerson";
import RescueReport from "./pages/RescueReport";
import Report from "./pages/Reports";
import { useState } from "react";


function App() {

  const [page, setPage] = useState("home");


  if (page === "missing") {
    return (
        <MissingPerson 
            goHome={()=>setPage("home")}
        />
    );
}


if(page==="rescue"){

    return (
        <RescueReport
            goHome={()=>setPage("home")}
        />
    );

}


if(page==="reports"){

    return (
        <Report
            goHome={()=>setPage("home")}
        />
    );

}
  return (
    <div style={styles.container}>

      <h1 style={styles.title}>
        Are They Safe?
      </h1>

      <h2 style={styles.subtitle}>
        Nepal Flood Response Platform
      </h2>

      <p style={styles.text}>
        Helping families reconnect with missing loved ones
        during disaster situations.
      </p>


      <div style={styles.buttons}>

      <button
      style={styles.button}
      onClick={() => setPage("missing")}
      >
      🔴 I am looking for someone
      </button>


      <button
      style={styles.button}
      onClick={()=>setPage("rescue")}
      >
      🟢 I found someone / Rescue Information
      </button>


      <button style={styles.button}>
      📢 Submit NGO / Government Update
      </button>

      <button
      style={styles.button}
      onClick={()=>setPage("reports")}
      >
      🔎 View Missing & Rescue Reports
      </button>

      </div>
    </div>
  )
}



const styles = {

  container:{
    minHeight:"100vh",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    background:"#f8fafc",
    padding:"30px",
    textAlign:"center"
  },


  title:{
    fontSize:"48px",
    marginBottom:"10px",
    color:"#0f172a",
    fontWeight:"700"
    },


  subtitle:{
    fontSize:"28px",
    color:"#334155",
    fontweight:"600",
  },


  text:{
    fontSize:"18px",
    maxWidth:"600px",
    marginBottom:"30px"
  },


  buttons:{
    display:"flex",
    flexDirection:"column",
    gap:"20px",
    width:"350px"
  },


  button:{
    padding:"15px",
    fontSize:"16px",
    borderRadius:"10px",
    border:"none",
    cursor:"pointer",
    background:"#2563eb",
    color:"white"
  }

}


export default App;