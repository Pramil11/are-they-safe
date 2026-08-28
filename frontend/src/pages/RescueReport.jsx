import { useState, useRef } from "react";

function RescueReport({ goHome }) {
  const [form, setForm] = useState({
    source_type: "",
    organization: "",
    person_name: "",
    age: "",
    location: "",
    district: "",
    status: "",
    contact: "",
    post_url: "",
    description: ""
  });

  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submitForm(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("source_type", form.source_type);
    formData.append("organization", form.organization);
    formData.append("person_name", form.person_name);
    formData.append("location", form.location);
    formData.append("district", form.district);
    formData.append("status", form.status);
    formData.append("contact", form.contact);
    formData.append("post_url", form.post_url);
    formData.append("description", form.description);

    if (form.age) {
      formData.append("age", form.age);
    }

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/rescue-report",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        setMessage("Something went wrong while submitting the rescue report.");
        return;
      }

      setMessage("Rescue information submitted successfully.");

      setTimeout(() => {
        setMessage("");
      }, 4000);

      setForm({
        source_type: "",
        organization: "",
        person_name: "",
        age: "",
        location: "",
        district: "",
        status: "",
        contact: "",
        post_url: "",
        description: ""
      });

      setPhoto(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Found Someone / Rescue Information</h1>

        <button
          type="button"
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

      <form style={styles.form} onSubmit={submitForm}>
        <input
          style={styles.input}
          name="source_type"
          value={form.source_type}
          placeholder="Source (NGO / Government / Individual)"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="organization"
          value={form.organization}
          placeholder="Organization Name"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="person_name"
          value={form.person_name}
          placeholder="Person Name (if known)"
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
          name="location"
          value={form.location}
          placeholder="Found Location"
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
          name="status"
          value={form.status}
          placeholder="Status (Safe / Hospital / Shelter)"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="contact"
          value={form.contact}
          placeholder="Contact Number"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="post_url"
          value={form.post_url}
          placeholder="Social Media / News Link"
          onChange={handleChange}
        />

        <textarea
          style={styles.textarea}
          name="description"
          value={form.description}
          placeholder="Additional information"
          onChange={handleChange}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const selectedFile = e.target.files[0];

            if (selectedFile) {
              setPhoto(selectedFile);
            }
          }}
        />

        {photo && (
          <div>
            <p>Selected Image: {photo.name}</p>

            <button
              type="button"
              style={styles.removeButton}
              onClick={() => {
                setPhoto(null);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Remove Image
            </button>
          </div>
        )}

        <button type="submit" style={styles.button}>
          Submit Rescue Information
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    background: "#f1f5f9",
    color: "#1e293b"
  },

  header: {
    width: "400px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "400px"
  },

  input: {
    padding: "14px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#111827"
  },

  textarea: {
    padding: "14px",
    height: "120px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#111827"
  },

  button: {
    padding: "15px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer"
  },

  removeButton: {
    padding: "10px",
    background: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  closeButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "#dc2626",
    color: "white",
    fontSize: "28px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0"
  },

  successMessage: {
    width: "400px",
    padding: "14px",
    marginBottom: "20px",
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #86efac",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "600"
  }
};

export default RescueReport;