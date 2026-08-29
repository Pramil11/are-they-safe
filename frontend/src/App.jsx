import { useCallback, useEffect, useState } from "react";
import MissingPerson from "./pages/MissingPerson";
import RescueReport from "./pages/RescueReport";

function App() {
  const [page, setPage] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("missing");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/all-reports"
      );

      if (!response.ok) {
        throw new Error("Failed to load reports");
      }

      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  if (page === "missing-form") {
    return (
      <MissingPerson
        goHome={() => {
          setPage("dashboard");
          setActiveTab("missing");
          loadReports();
        }}
      />
    );
  }

  if (page === "rescue-form") {
    return (
      <RescueReport
        goHome={() => {
          setPage("dashboard");
          setActiveTab("rescued");
          loadReports();
        }}
      />
    );
  }

  const missingReports = reports.filter(
    (report) => report.status?.toLowerCase() === "missing"
  );

  const rescuedReports = reports.filter(
    (report) => report.status?.toLowerCase() !== "missing"
  );

  const visibleReports =
    activeTab === "missing"
      ? missingReports
      : rescuedReports;

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
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Are They Safe?</h1>
          <p style={styles.subtitle}>
            Nepal Flood Response Platform
          </p>
        </div>

        <div style={styles.reportButtons}>
          <button
            style={styles.missingButton}
            onClick={() => setPage("missing-form")}
          >
            + Report Missing Person
          </button>

          <button
            style={styles.rescueButton}
            onClick={() => setPage("rescue-form")}
          >
            + Report Rescued Person
          </button>
        </div>
      </header>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "missing"
              ? styles.activeMissingTab
              : {})
          }}
          onClick={() => setActiveTab("missing")}
        >
          Missing Persons ({missingReports.length})
        </button>

        <button
          style={{
            ...styles.tab,
            ...(activeTab === "rescued"
              ? styles.activeRescueTab
              : {})
          }}
          onClick={() => setActiveTab("rescued")}
        >
          Rescued / Found ({rescuedReports.length})
        </button>
      </div>

      <main style={styles.content}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {activeTab === "missing"
              ? "Missing Persons"
              : "Rescued / Found People"}
          </h2>

          <p style={styles.sectionDescription}>
            {activeTab === "missing"
              ? "People currently reported missing."
              : "People reported rescued, found, or safe."}
          </p>
        </div>

        {loading ? (
          <p>Loading reports...</p>
        ) : visibleReports.length === 0 ? (
          <div style={styles.empty}>
            No reports available.
          </div>
        ) : (
          <div style={styles.grid}>
            {visibleReports.map((person, index) => (
              <div style={styles.card} key={person.id || index}>
                {person.photo_url ? (
                  <img
                    src={`http://127.0.0.1:8000/${person.photo_url}`}
                    alt={person.name || "Person"}
                    style={styles.image}
                  />
                ) : (
                  <div style={styles.noImage}>
                    No Photo
                  </div>
                )}

                <div style={styles.cardBody}>
                  <div style={styles.nameRow}>
                    <h3 style={styles.name}>
                      {displayValue(person.name)}
                    </h3>

                    <span
                      style={
                        activeTab === "missing"
                          ? styles.missingBadge
                          : styles.safeBadge
                      }
                    >
                      {displayValue(person.status)}
                    </span>
                  </div>

                  <p>
                    <strong>Age:</strong>{" "}
                    {displayValue(person.age)}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {displayValue(person.location)}
                  </p>

                  <p>
                    <strong>District:</strong>{" "}
                    {displayValue(person.district)}
                  </p>

                  <p>
                    <strong>Contact:</strong>{" "}
                    {displayValue(person.phone)}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {displayValue(person.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    color: "#1e293b"
  },

  header: {
    background: "white",
    padding: "24px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    borderBottom: "1px solid #e2e8f0"
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#0f172a"
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#64748b"
  },

  reportButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },

  missingButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600"
  },

  rescueButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600"
  },

  tabs: {
    background: "white",
    display: "flex",
    padding: "0 40px",
    borderBottom: "1px solid #e2e8f0"
  },

  tab: {
    padding: "16px 20px",
    border: "none",
    borderBottom: "3px solid transparent",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
    color: "#64748b",
    fontWeight: "600"
  },

  activeMissingTab: {
    color: "#dc2626",
    borderBottom: "3px solid #dc2626"
  },

  activeRescueTab: {
    color: "#16a34a",
    borderBottom: "3px solid #16a34a"
  },

  content: {
    padding: "30px 40px"
  },

  sectionHeader: {
    marginBottom: "25px"
  },

  sectionTitle: {
    margin: 0,
    fontSize: "26px"
  },

  sectionDescription: {
    marginTop: "6px",
    color: "#64748b"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "22px"
  },

  card: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e2e8f0"
  },

  image: {
    width: "100%",
    height: "240px",
    objectFit: "cover"
  },

  noImage: {
    height: "240px",
    background: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "18px"
  },

  cardBody: {
    padding: "18px"
  },

  nameRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px"
  },

  name: {
    margin: "0 0 12px",
    fontSize: "21px"
  },

  missingBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700"
  },

  safeBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700"
  },

  empty: {
    background: "white",
    padding: "40px",
    textAlign: "center",
    borderRadius: "10px",
    color: "#64748b"
  }
};

export default App;