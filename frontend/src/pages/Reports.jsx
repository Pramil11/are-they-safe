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
});


},[]);



const displayValue=(value)=>{

    if(
        value === null ||
        value === undefined ||
        value === ""
    ){
        return "N/A";
    }

    return value;

};



return (

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
person.photo && person.photo !== "N/A"

?

<img
src={`http://127.0.0.1:8000/${person.photo}`}
style={styles.image}
/>

:

<div style={styles.noImage}>
No Photo
</div>

}



<h2>
{displayValue(person.name)}
</h2>


<p>
Age:
{displayValue(person.age)}
</p>


<p>
Location:
{displayValue(person.location)}
</p>


<p>
District:
{displayValue(person.district)}
</p>


<p>
Status:
<strong>
{displayValue(person.status)}
</strong>
</p>


<p>
Description:
{displayValue(person.description)}
</p>


<p>
Contact:
{displayValue(person.phone)}
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
padding:"40px",
background:"#f8fafc",
minHeight:"100vh"
},


grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
gap:"25px"
},


card:{
background:"white",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
},


image:{
width:"100%",
height:"250px",
objectFit:"cover",
borderRadius:"10px"
},


noImage:{
height:"250px",
background:"#e5e7eb",
display:"flex",
alignItems:"center",
justifyContent:"center",
borderRadius:"10px",
fontSize:"20px"
},

header:{
    width:"100%",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"25px"
},


closeButton:{
    width:"40px",
    height:"40px",
    borderRadius:"50%",
    border:"none",
    background:"#dc2626",
    color:"white",
    fontSize:"28px",
    fontWeight:"bold",
    cursor:"pointer",
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
}

}

export default Reports;