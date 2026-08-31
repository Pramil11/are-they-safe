import { useState } from "react";

function ManageReport({ goHome, refreshReports }) {
  const [type, setType] = useState("missing");
  const [token, setToken] = useState("");
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function findReport() {
    if (!token) {
      setMessage("Please enter your management code.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/manage/${type}/${token}`
      );

      const data = await response.json();

      if (!data.success) {
        setReport(null);
        setMessage("Report not found. Please check your management code.");
        return;
      }

      setReport(data.data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    }
  }

  function handleChange(e) {
    setReport({
      ...report,
      [e.target.name]: e.target.value
    });
  }

  async function updateReport(e) {
    e.preventDefault();

    const formData = new FormData();

    if (type === "missing") {
      formData.append("name", report.name || "");
      formData.append("phone", report.phone || "");
      formData.append("location", report.location || "");
      formData.append("district", report.district || "");
      formData.append("description", report.description || "");

      if (report.age) {
        formData.append("age", report.age);
      }

      if (report.last_seen_date) {
        formData.append("last_seen_date", report.last_seen_date);
      }
    } else {
      formData.append("source_type", report.source_type || "");
      formData.append("organization", report.organization || "");
      formData.append("person_name", report.person_name || "");
      formData.append("location", report.location || "");
      formData.append("district", report.district || "");
      formData.append("status", report.status || "");
      formData.append("contact", report.contact || "");
      formData.append("post_url", report.post_url || "");
      formData.append("description", report.description || "");

      if (report.age) {
        formData.append("age", report.age);
      }
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/manage/${type}/${token}`,
        {
          method: "PUT",
          body: formData
        }
      );

      const data = await response.json();

      if (!data.success) {
        setMessage("Unable to update report.");
        return;
      }

      setMessage("Report updated successfully.");

      if (refreshReports) {
        refreshReports();
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    }
  }

  async function deleteReport() {
    setShowDeleteConfirm(false);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/manage/${type}/${token}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!data.success) {
        setMessage("Unable to delete report.");
        return;
      }

      setMessage("Report deleted successfully.");
      setReport(null);
      setToken("");

      if (refreshReports) {
        refreshReports();
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the server.");
    }
  }

  async function markAsFound(){

const response = await fetch(
`http://127.0.0.1:8000/manage/missing/${token}/found`,
{
method:"PUT"
}
);


const data = await response.json();


if(data.success){
  setMessage("Person marked as found successfully");

  setReport({
    ...report,
    status:"Found"
  });
  if (refreshReports) {
    refreshReports();
  }
} else {
  setMessage("Unable to update report.");
}
}

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Manage My Report</h1>

        <button
          type="button"
          style={styles.closeButton}
          onClick={goHome}
        >
          ×
        </button>
      </div>

      <div style={styles.lookupBox}>
        <select
          style={styles.input}
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setReport(null);
            setMessage("");
          }}
        >
          <option value="missing">Missing Person Report</option>
          <option value="rescue">Rescue / Found Report</option>
        </select>

        <input
          style={styles.input}
          value={token}
          placeholder="Enter management code"
          onChange={(e) => setToken(e.target.value)}
        />

        <button
          style={styles.findButton}
          onClick={findReport}
        >
          Find My Report
        </button>
      </div>

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {report && (
        <form
          style={styles.form}
          onSubmit={updateReport}
        >
          {type === "missing" ? (
            <>
              <input
                style={styles.input}
                name="name"
                value={report.name || ""}
                placeholder="Full Name"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="age"
                type="number"
                value={report.age || ""}
                placeholder="Age"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="phone"
                value={report.phone || ""}
                placeholder="Contact Phone Number"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="location"
                value={report.location || ""}
                placeholder="Last Known Location"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="district"
                value={report.district || ""}
                placeholder="District"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="last_seen_date"
                type="date"
                value={report.last_seen_date || ""}
                onChange={handleChange}
              />

              <textarea
                style={styles.textarea}
                name="description"
                value={report.description || ""}
                placeholder="Description"
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <input
                style={styles.input}
                name="source_type"
                value={report.source_type || ""}
                placeholder="Source"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="organization"
                value={report.organization || ""}
                placeholder="Organization"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="person_name"
                value={report.person_name || ""}
                placeholder="Person Name"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="age"
                type="number"
                value={report.age || ""}
                placeholder="Age"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="location"
                value={report.location || ""}
                placeholder="Found Location"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="district"
                value={report.district || ""}
                placeholder="District"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="status"
                value={report.status || ""}
                placeholder="Status"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="contact"
                value={report.contact || ""}
                placeholder="Contact"
                onChange={handleChange}
              />

              <input
                style={styles.input}
                name="post_url"
                value={report.post_url || ""}
                placeholder="Social Media / News Link"
                onChange={handleChange}
              />

              <textarea
                style={styles.textarea}
                name="description"
                value={report.description || ""}
                placeholder="Description"
                onChange={handleChange}
              />
            </>
          )}

          <button
            type="submit"
            style={styles.updateButton}
          >
            Save Changes
          </button>

          <button
            type="button"
            style={styles.deleteButton}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Report
          </button>

          {
            type === "missing" && (
                <button
                type="button"
                style={styles.foundButton}
                onClick={markAsFound}
                >
                Mark as Found
                </button>
            )
          }
        </form>
      )}

      {showDeleteConfirm && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h2>Delete Report?</h2>

      <p>
        Are you sure you want to permanently delete this report?
        This action cannot be undone.
      </p>

      <div style={styles.modalButtons}>
        <button
          type="button"
          style={styles.cancelButton}
          onClick={() => setShowDeleteConfirm(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          style={styles.confirmDeleteButton}
          onClick={deleteReport}
        >
          Delete Permanently
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "40px 20px",
    color: "#1e293b"
  },

  header: {
    width: "400px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  lookupBox: {
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px"
  },

  form: {
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px"
  },

  input: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    background: "white"
  },

  textarea: {
    padding: "14px",
    height: "120px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "16px"
  },

  findButton: {
    padding: "14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  },

  updateButton: {
    padding: "14px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  },

  deleteButton: {
    padding: "14px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  },

  closeButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "#dc2626",
    color: "white",
    fontSize: "28px",
    cursor: "pointer"
  },

  message: {
    width: "400px",
    marginTop: "15px",
    padding: "12px",
    borderRadius: "8px",
    background: "white",
    textAlign: "center"
  },

  modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
},

modal: {
  width: "400px",
  maxWidth: "90%",
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  textAlign: "center"
},

modalButtons: {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  marginTop: "20px"
},

cancelButton: {
  padding: "12px 18px",
  background: "#64748b",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
},

confirmDeleteButton: {
  padding: "12px 18px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
},
foundButton: {
  padding: "14px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px"
},
};

export default ManageReport;