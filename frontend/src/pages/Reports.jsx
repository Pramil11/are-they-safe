import { useEffect, useState } from "react";

function Reports({goHome}){

const [reports,setReports] = useState([]);
useEffect(()=>{
    fetch("http://127.0.0.1:8000/all-reports")
    .then(res=>res.json())
    .then(data=>{
        setReports(data);
    })
    .catch(error=>{
        console.log(error);
    })
},[]);

return(
<div style={styles.container}>
<div style={styles.header}>

<h1>
Missing & Rescue Reports
</h1>

<button
onClick={goHome}
style={styles.closeButton}
>
×
</button>

</div>

<div style={styles.grid}>

{
reports.map((person,index)=>(
<div 
key={index}
style={styles.card}
>
{
person.photo_url ?
<img
src={
"http://127.0.0.1:8000/"+person.photo_url.replace("\\","/")
}
style={styles.image}
/>
:
<div style={styles.noImage}>
No Photo
</div>

}

<h2>
{person.name}
</h2>
<p>
<b>Status:</b> {person.status}
</p>

<p>
<b>Age:</b> {person.age}
</p>

<p>
<b>Location:</b> {person.location}
</p>

<p>
<b>District:</b> {person.district}
</p>

<p>
<b>Phone:</b> {person.phone}
</p>

<p>
{person.description}
</p>

</div>
))
}
</div>
</div>
)
}
const styles={
container:{
minHeight:"100vh",
padding:"40px",
background:"#f1f5f9"
},

header:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"30px"
},

closeButton:{
width:"40px",
height:"40px",
borderRadius:"50%",
border:"none",
background:"#dc2626",
color:"white",
fontSize:"28px",
cursor:"pointer"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
gap:"20px"
},

card:{
background:"white",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 4px 10px rgba(0,0,0,0.1)"
},

image:{
width:"100%",
height:"250px",
objectFit:"cover",
borderRadius:"10px"
},

noImage:{
height:"250px",
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"#e2e8f0",
borderRadius:"10px",
fontSize:"20px"
}

}
export default Reports;