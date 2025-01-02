import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import CommunicationModal from "./CommunicationModal";
import styles from "./UserPage.module.css";
import CalendarView from "./components/CalendarView";
import Notification from "./components/Notification";

function UserPage() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communications, setCommunications] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const calculateNotificationCounts = (data) => {
    const today = new Date().toDateString();
    let overdue = 0;
    let todayCount = 0;

    data.forEach((item) => {
      const communicationDate = new Date(item.communicationDate);
      if (communicationDate < new Date()) overdue++;
      if (communicationDate.toDateString() === today) todayCount++;
    });

    setOverdueCount(overdue);
    setTodayCount(todayCount);
  };

  const fetchCommunications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("https://calendar-application-for-communication-a7y1.onrender.com/api/communications");
      if (response.data.success && Array.isArray(response.data.data)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date

        const formattedData = response.data.data.map((item) => {
          const communicationDate = new Date(item.communicationDate);
          const isOverdue = communicationDate < today;

          return {
            ...item,
            communicationDate: communicationDate.toLocaleDateString(),
            lastCommunications: isOverdue
              ? [{
                communicationType: item.communicationType,
                communicationDate: communicationDate.toLocaleDateString(),
              }]
              : [],
            nextDue: !isOverdue
              ? {
                communicationType: item.communicationType,
                communicationDate: communicationDate.toLocaleDateString(),
              }
              : null,
          };
        });

        setCommunications(formattedData);
        calculateNotificationCounts(formattedData);
      } else {
        setError("Unexpected response structure.");
      }
    } catch (err) {
      console.error("Error fetching communications:", err);
      setError("Error fetching communications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [refreshCount]);

  useEffect(() => {
    fetchCommunications();
  }, [fetchCommunications]);

  const handleCommunicationAdded = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className={styles.userPage}>
      <header className={styles.userHeader}>
        <button
          className={styles.navButton}
          onClick={() => setCurrentView("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={styles.navButton}
          onClick={() => setCurrentView("calendar")}
        >
          Calendar
        </button>
        <button
          className={`${styles.navButton} ${styles.notifications}`}
          onClick={() => setCurrentView("notifications")}
        >
          Notifications
        </button>
      </header>

      <main className={styles.content}>
        {loading && <div>Loading...</div>}

        {currentView === "dashboard" && !isModalOpen && !loading && (
          <>
            <h2>Company Communications</h2>
            <button
              className={styles.addButton}
              onClick={() => setIsModalOpen(true)}
            >
              + Communication Performed
            </button>

            <table className={styles.communicationsTable}>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Company</th>
                  <th>Last Communication</th>
                  <th>Next Due</th>
                </tr>
              </thead>
              <tbody>
                {communications.length > 0 ? (
                  communications.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>
                        <strong>{item.companyName}</strong>
                      </td>
                      <td>
                        {item.lastCommunications.length > 0
                          ? item.lastCommunications.map((comm, idx) => (
                            <p key={idx}>
                              {comm.communicationType} - {comm.communicationDate}
                            </p>
                          ))
                          : "No communications available"}
                      </td>
                      <td>
                        {item.nextDue ? (
                          <p>
                            {item.nextDue.communicationType} - {item.nextDue.communicationDate}
                          </p>
                        ) : (
                          "No upcoming communications"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No communications available</td>
                  </tr>
                )}
              </tbody>
            </table>

            {error && <div className={styles.error}>Error: {error}</div>}
          </>
        )}

        {currentView === "calendar" && <CalendarView />}
        {currentView === "notifications" && (
          <Notification overdueCount={overdueCount} todayCount={todayCount} />
        )}
        {isModalOpen && (
          <CommunicationModal
            onCancel={() => setIsModalOpen(false)}
            onCommunicationAdded={handleCommunicationAdded}
          />
        )}
      </main>
    </div>
  );
}

export default UserPage;
