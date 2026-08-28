import { useState, useRef } from "react";


function RescueReport({goHome}){


const [form,setForm]=useState({

source_type:"",
organization:"",
person_name:"",
age:"",
location:"",
district:"",
status:"",
contact:"",
post_url:"",
description:""

});


const [photo,setPhoto]=useState(null);
const fileInputRef = useRef(null);



function handleChange(e){

setForm({
...form,
[e.target.name]:e.target.value
});

}



async function submitForm(e){

e.preventDefault();

if(!photo){
    alert("Please upload a photo");
    return;
}

const formData = new FormData();


Object.keys(form).forEach((key)=>{

formData.append(
key,
form[key]
);

});


if(photo){
    formData.append("photo", photo);
}



const response = await fetch(

"http://127.0.0.1:8000/rescue-report",

{

method:"POST",

body:formData

}

);

console.log([...formData.entries()]);

const data = await response.json();


alert(data.message);


}



return (

<div style={styles.container}>


<div style={styles.header}>

<h1>
Found Someone / Rescue Information
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
name="source_type"
placeholder="Source (NGO / Government / Individual)"
onChange={handleChange}
/>


<input
style={styles.input}
name="organization"
placeholder="Organization Name"
onChange={handleChange}
/>


<input
style={styles.input}
name="person_name"
placeholder="Person Name (if known)"
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
name="location"
placeholder="Found Location"
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
name="status"
placeholder="Status (Safe / Hospital / Shelter)"
onChange={handleChange}
/>


<input
style={styles.input}
name="contact"
placeholder="Contact Number"
onChange={handleChange}
/>


<input
style={styles.input}
name="post_url"
placeholder="Social Media / News Link"
onChange={handleChange}
/>


<textarea
style={styles.textarea}
name="description"
placeholder="Additional information"
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
Submit Rescue Information
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
background:"#f1f5f9"
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
border:"1px solid #cbd5e1"
},


textarea:{
padding:"14px",
height:"120px",
borderRadius:"8px",
border:"1px solid #cbd5e1"
},


button:{
padding:"15px",
background:"#16a34a",
color:"white",
border:"none",
borderRadius:"8px",
fontSize:"16px"
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


export default RescueReport;