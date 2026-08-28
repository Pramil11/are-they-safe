import { useState, useRef } from "react";


function MissingPerson({goHome}){

const [form,setForm]=useState({
    name:"",
    age:"",
    phone:"",
    location:"",
    district:"",
    last_seen_date:"",
    description:""
});

const [photo,setPhoto]=useState(null);
const fileInputRef = useRef(null);

function handleChange(e){

setForm({
    ...form,
    [e.target.name]: e.target.value
});

}

async function submitForm(e){

e.preventDefault();


const formData = new FormData();


formData.append("name", form.name);
formData.append("age", Number(form.age));
formData.append("phone", form.phone);
formData.append("location", form.location);
formData.append("district", form.district);
formData.append("last_seen_date", form.last_seen_date);
formData.append("description", form.description);
if(photo){
    formData.append("photo", photo);
}

console.log([...formData.entries()]);

const response = await fetch(
"http://127.0.0.1:8000/missing-person",
{
method:"POST",
body:formData
}
);


const data = await response.json();


alert(data.message);

}



return (

<div style={styles.container}>

<div style={styles.header}>

<h1>
Report Missing Person
</h1>


<button
onClick={goHome}
style={styles.closeButton}
>
×
</button>


</div>


<form 
style={styles.form}
onSubmit={submitForm}
>


<input
style={styles.input}
name="name"
placeholder="Full Name"
onChange={handleChange}
/>


<input
style={styles.input}
name="age"
type="number"
placeholder="Age"
onChange={handleChange}
/>


<input
style={styles.input}
name="phone"
placeholder="Contact Phone Number"
onChange={handleChange}
/>


<input
style={styles.input}
name="location"
placeholder="Last Known Location"
onChange={handleChange}
/>


<input
style={styles.input}
name="district"
placeholder="District"
onChange={handleChange}
/>


<input
style={styles.input}
name="last_seen_date"
type="date"
onChange={handleChange}
/>


<textarea
style={styles.textarea}
name="description"
placeholder="Description (clothing, identification marks, etc.)"
onChange={handleChange}
/>

<input
ref={fileInputRef}
type="file"
accept="image/*"
onChange={(e)=>setPhoto(e.target.files[0])}
/>

{
photo && (

<div>

<p>
Selected Image: {photo.name}
</p>


<button
type="button"
onClick={()=>{

setPhoto(null);

if(fileInputRef.current){
    fileInputRef.current.value="";
}

}}
>
Remove Image
</button>


</div>

)
}

<button style={styles.button}>
Submit Missing Report
</button>


</form>

</div>

)

}



const styles={

container:{
minHeight:"100vh",
display:"flex",
flexDirection:"column",
alignItems:"center",
padding:"40px 20px",
background:"#f1f5f9",
color:"#1e293b"
},

form:{
display:"flex",
flexDirection:"column",
gap:"15px",
width:"400px"
},


input:{
padding:"14px",
fontSize:"16px",
borderRadius:"8px",
border:"1px solid #cbd5e1",
background:"white",
color:"#111827"
},


textarea:{
padding:"14px",
height:"120px",
fontSize:"16px",
borderRadius:"8px",
border:"1px solid #cbd5e1",
background:"white",
color:"#111827"
},


button:{
padding:"15px",
background:"#dc2626",
color:"white",
border:"none",
borderRadius:"8px",
fontSize:"16px",
cursor:"pointer"
},

removeButton:{
padding:"10px",
background:"#64748b",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer"
},

header:{
    width:"400px",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
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

export default MissingPerson;