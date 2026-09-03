import { useEffect, useState } from "react";

function PersonAIMatches({ person, goBack }) {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    async function fetchMatches() {
      if (!person) return;
      try {
        const response = await fetch(
            `http://127.0.0.1:8000/ai/person-matches/${person.status === "Missing" ? "missing" : "rescue"}/${person.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await response.json();

        setMatches(data);

      } catch(error) {

        console.error(
          "Failed to load AI matches:",
          error
        );

        setMatches([]);
      } finally {
        setLoading(false);
      }

    }

    fetchMatches();
  }, [person]);
  return (
    <div style={styles.container}>
      <button
        style={styles.backButton}
        onClick={goBack}
      >
        ← Back
      </button>
      <h1>
        AI Matches For {person?.name}
      </h1>
      {
        loading ?
        <p>
          AI is searching...
        </p>
        :
        matches.length === 0 ?
        <div style={styles.empty}>
          No matches above 80% found.
        </div>
        :
        matches.map((match,index)=>(
            <div
            key={index}
            style={styles.card}
            >
            <h2>
            Possible Match
            </h2>
            <div style={styles.row}>
            {/* Missing Person */}
            <div style={styles.personBox}>
            <h2>
            Missing Person
            </h2>
            {
            match.person1.photo_url &&
            <img
            src={`http://127.0.0.1:8000/${match.person1.photo_url}`}
            style={styles.image}
            />
            }
            <h3>
            {match.person1.name}
            </h3>
            <p>
            <strong>Age:</strong> {match.person1.age}
            </p>
            <p>
            <strong>Phone:</strong> {match.person1.phone}
            </p>
            <p>
            <strong>Location:</strong> {match.person1.location}
            </p>
            <p>
            <strong>District:</strong> {match.person1.district}
            </p>
            <p>
            <strong>Description:</strong> {match.person1.description}
            </p>
            </div>
            {/* Rescue Person */}
            <div style={styles.personBox}>

            <h2>
            Rescued Person
            </h2>

            {
            match.person2.photo_url &&
            <img
            src={`http://127.0.0.1:8000/${match.person2.photo_url}`}
            style={styles.image}
            />
            }
            <h3>
            {match.person2.person_name}
            </h3>
            <p>
            <strong>Age:</strong> {match.person2.age}
            </p>
            <p>
            <strong>Contact:</strong> {match.person2.contact}
            </p>
            <p>
            <strong>Location:</strong> {match.person2.location}
            </p>
            <p>
            <strong>District:</strong> {match.person2.district}
            </p>
            <p>
            <strong>Description:</strong> {match.person2.description}
            </p>
            </div>
            </div>
            <h2>
            AI Similarity:
            {match.final_score}%
            </h2>
            <span style={styles.badge}>
            Needs Human Verification
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
  marginTop:"25px",
  maxWidth:"800px"
},

row:{
  display:"flex",
  justifyContent:"space-between",
  gap:"40px"
},

badge:{
  background:"#fef3c7",
  color:"#92400e",
  padding:"8px 14px",
  borderRadius:"20px",
  fontWeight:"600"
},

empty:{
  background:"white",
  padding:"40px",
  borderRadius:"10px"
}
};

export default PersonAIMatches;