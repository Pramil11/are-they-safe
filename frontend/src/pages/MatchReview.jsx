function MatchReview({match, goBack}) {

return (

<div style={styles.container}>

<button
style={styles.back}
onClick={goBack}
>
← Back
</button>


<h1>
Match Verification
</h1>


<div style={styles.card}>

<h2>
Missing Person
</h2>

<p>
{match.missing_name}
</p>


<h2>
Found Person
</h2>

<p>
{match.found_name}
</p>


<h2>
AI Scores
</h2>

<p>
Text Similarity:
{match.text_score}%
</p>

<p>
Image Similarity:
{match.image_score}%
</p>

<p>
Final AI Confidence:
{match.final_score}%
</p>


<button style={styles.verify}>
Confirm Match
</button>


</div>

</div>

)

}


const styles={

container:{
padding:"40px",
background:"#f1f5f9",
minHeight:"100vh"
},

card:{
background:"white",
padding:"30px",
borderRadius:"12px",
maxWidth:"600px"
},

back:{
padding:"10px 20px",
background:"#475569",
color:"white",
border:"none",
borderRadius:"8px"
},

verify:{
marginTop:"20px",
padding:"14px",
background:"#16a34a",
color:"white",
border:"none",
borderRadius:"8px"
}

}


export default MatchReview;