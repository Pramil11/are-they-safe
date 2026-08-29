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
const [message, setMessage] = useState("");

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
formData.append("phone", form.phone);
formData.append("location", form.location);
formData.append("district", form.district);
formData.append("description", form.description);

if (form.age) {
    formData.append("age", form.age);
}

if (form.last_seen_date) {
    formData.append("last_seen_date", form.last_seen_date);
}

if (photo) {
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

if (!response.ok) {
  setMessage("Something went wrong while submitting the report.");
  return;
}

const data = await response.json();

setMessage(
  `Missing person report submitted successfully. Your management code is: ${data.manage_token}`
);

setTimeout(() => {
  setMessage("");
}, 10000);

setForm({
    name:"",
    age:"",
    phone:"",
    location:"",
    district:"",
    last_seen_date:"",
    description:""
});

setPhoto(null);
if(fileInputRef.current){
    fileInputRef.current.value="";
}

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
{message && (
    <div style={styles.successMessage}>
        {message}
    </div>
)}
<form 
style={styles.form}
onSubmit={submitForm}
>
<input
style={styles.input}
name="name"
value={form.name}
placeholder="Full Name"
onChange={handleChange}
/>
<input
style={styles.input}
name="age"
type="number"
value={form.age}
placeholder="Age"
onChange={handleChange}
/>
<input
style={styles.input}
name="phone"
value={form.phone}
placeholder="Contact Phone Number"
onChange={handleChange}
/>
<input
style={styles.input}
name="location"
value={form.location}
placeholder="Last Known Location"
onChange={handleChange}
/>
<input
style={styles.input}
name="district"
value={form.district}
placeholder="District"
onChange={handleChange}
/>
<input
style={styles.input}
name="last_seen_date"
type="date"
value={form.last_seen_date}
onChange={handleChange}
/>
<textarea
style={styles.textarea}
name="description"
value={form.description}
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
},
successMessage:{
    width:"400px",
    padding:"14px",
    marginBottom:"20px",
    background:"#dcfce7",
    color:"#166534",
    border:"1px solid #86efac",
    borderRadius:"8px",
    textAlign:"center",
    fontWeight:"600"
},

}

export default MissingPerson;