function ReportDetails({ report, goBack, openAIMatches }) {

  function displayValue(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "N/A";
    }

    return value;
  }

  return (
    <div style={styles.container}>

      <button
        style={styles.backButton}
        onClick={goBack}
      >
        ← Back to Reports
      </button>

      <div style={styles.card}>

        {report.photo_url ? (
          <img
            src={`http://127.0.0.1:8000/${report.photo_url}`}
            alt={report.name}
            style={styles.image}
          />
        ) : (
          <div style={styles.noImage}>
            No Photo
          </div>
        )}

        <div style={styles.content}>

          <h1>
            {displayValue(report.name)}
          </h1>

          <span style={
            report.status?.toLowerCase() === "missing"
              ? styles.missing
              : styles.safe
          }>
            {displayValue(report.status)}
          </span>


          <p>
            <strong>Age:</strong>{" "}
            {displayValue(report.age)}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {displayValue(report.phone)}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {displayValue(report.location)}
          </p>

          <p>
            <strong>District:</strong>{" "}
            {displayValue(report.district)}
          </p>

          <p>
            <strong>Last Seen Date:</strong>{" "}
            {displayValue(report.last_seen_date)}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {displayValue(report.description)}
          </p>

          <button
            style={styles.aiButton}
            onClick={() => openAIMatches(report)}
          >
            🤖 AI Find Matches
          </button>

        </div>

      </div>

    </div>
  );
}


const styles = {

container:{
  minHeight:"100vh",
  background:"#f1f5f9",
  padding:"40px"
},

backButton:{
  padding:"12px 18px",
  border:"none",
  borderRadius:"8px",
  background:"#475569",
  color:"white",
  cursor:"pointer",
  marginBottom:"25px"
},

card:{
  background:"white",
  maxWidth:"600px",
  borderRadius:"12px",
  overflow:"hidden"
},

image:{
  width:"100%",
  height:"350px",
  objectFit:"cover"
},

noImage:{
  height:"350px",
  background:"#e2e8f0",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontSize:"22px"
},

content:{
  padding:"25px"
},

missing:{
  background:"#fee2e2",
  color:"#991b1b",
  padding:"6px 12px",
  borderRadius:"20px"
},

safe:{
  background:"#dcfce7",
  color:"#166534",
  padding:"6px 12px",
  borderRadius:"20px"
},

aiButton:{
  marginTop:"20px",
  padding:"12px 18px",
  background:"#7c3aed",
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer",
  fontSize:"16px",
  fontWeight:"600"
}

};


export default ReportDetails;