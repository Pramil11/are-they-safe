import { useEffect, useState } from "react";


function AIMatches({ goHome }) {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);


  async function loadMatches() {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/ai/matches"
      );

      const data = await response.json();

      setMatches(data);

    } catch(error){

      console.error(
        "Failed to load AI matches",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadMatches();

  }, []);


  return (

    <div style={styles.container}>

      <div style={styles.header}>

        <h1>
          AI Possible Matches
        </h1>


        <button
          style={styles.backButton}
          onClick={goHome}
        >
          ← Back
        </button>

      </div>


      {
        loading ?

        <p>
          AI is searching for possible matches...
        </p>


        :

        matches.length === 0 ?

        <div style={styles.empty}>
          No possible matches found.
        </div>


        :


        matches.map((match,index)=>(

          <div
            key={index}
            style={styles.card}
          >

            <h2>
              Possible Match Found
            </h2>


            <p>
              <strong>
                Missing Person:
              </strong>{" "}
              {match.missing_name}
            </p>


            <p>
              <strong>
                Found Person:
              </strong>{" "}
              {match.found_name}
            </p>


            <p>
              <strong>
                AI Confidence:
              </strong>{" "}
              {match.confidence}%
            </p>


            <span style={styles.badge}>
              {match.status}
            </span>


          </div>

        ))

      }


    </div>

  );

}


const styles = {

container:{
  minHeight:"100vh",
  background:"#f1f5f9",
  padding:"40px",
  color:"#1e293b"
},


header:{
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:"30px"
},


backButton:{
  padding:"12px 18px",
  background:"#475569",
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
},


card:{
  background:"white",
  padding:"25px",
  borderRadius:"12px",
  marginBottom:"20px",
  maxWidth:"600px",
  border:"1px solid #e2e8f0"
},


badge:{
  display:"inline-block",
  marginTop:"15px",
  padding:"8px 14px",
  borderRadius:"20px",
  background:"#fef3c7",
  color:"#92400e",
  fontWeight:"600"
},


empty:{
  background:"white",
  padding:"40px",
  borderRadius:"10px",
  textAlign:"center"
}


};


export default AIMatches;