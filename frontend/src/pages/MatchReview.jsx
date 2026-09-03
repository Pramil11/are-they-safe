import { useEffect, useState } from "react";

function MatchReview({match, goBack}) {
const [details,setDetails] = useState(null);

useEffect(()=>{
async function loadDetails(){
const response = await fetch(
`http://127.0.0.1:8000/ai/match/${match.missing_id}/${match.rescue_id}`
);
const data = await response.json();
setDetails(data);
}
if(match){
loadDetails();
}
},[match]);

if(!details){
return <h2>Loading match details...</h2>
}
return (
<div style={styles.container}>

<button
style={styles.back}
onClick={goBack}
>
← Back
</button>

<h1>
AI Match Verification
</h1>

<div style={styles.compare}>

<PersonCard
title="Missing Person"
person={details.missing}
/>

<PersonCard
title="Found Person"
person={details.rescue}
/>

</div>
<div style={styles.aiBox}>
<h2>
AI Analysis
</h2>
<p>
Text Similarity: {match.text_score}%
</p>
<p>
Image Similarity: {match.image_score}%
</p>
<h2>
Final Score: {match.final_score}%
</h2>
</div>
</div>
)
}

function PersonCard({title,person}){
return (

<div style={styles.card}>

<h2>
{title}
</h2>

{
person.photo_url ?

<img
src={`http://127.0.0.1:8000/${person.photo_url}`}
style={styles.image}
/>
:
<div style={styles.noImage}>
No Photo
</div>
}

<p>
<strong>Name:</strong> {person.name || person.person_name}
</p>

<p>
<strong>Age:</strong> {person.age}
</p>

<p>
<strong>Location:</strong> {person.location}
</p>

<p>
<strong>District:</strong> {person.district}
</p>

<p>
<strong>Description:</strong> {person.description}
</p>
</div>
)
}

const styles={
container:{
padding:"40px",
background:"#f1f5f9",
minHeight:"100vh"
},

compare:{
display:"flex",
gap:"30px"
},

card:{
background:"white",
padding:"25px",
borderRadius:"12px",
width:"400px"
},

image:{
width:"100%",
height:"300px",
objectFit:"cover"
},

noImage:{
height:"300px",
background:"#e2e8f0",
display:"flex",
alignItems:"center",
justifyContent:"center"
},

aiBox:{
marginTop:"30px",
background:"white",
padding:"25px",
borderRadius:"12px"
},

back:{
padding:"12px 20px",
background:"#475569",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer"
}
}
export default MatchReview;