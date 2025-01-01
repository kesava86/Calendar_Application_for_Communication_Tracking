import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Notification.module.css";

const Notification = ({ refresh }) => {
  const [overdueCommunications, setOverdueCommunications] = useState([]);
  const [dueToday, setDueToday] = useState([]);

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/communications");
        const communications = response.data.data;

        if (!Array.isArray(communications)) {
          console.error("Invalid data structure from API.");
          return;
        }

        const today = new Date();
        const overdue = [];
        const todayList = [];

        communications.forEach((communication) => {
          const communicationDate = new Date(communication.communicationDate);
          const differenceInDays = Math.floor((today - communicationDate) / (1000 * 60 * 60 * 24));

          if (differenceInDays > 0) {
            overdue.push({
              id: communication._id,
              name: communication.companyName || "Unknown Company",
              communicationType: communication.communicationType,
              lastCommunication: communication.communicationDate,
              overdueDays: differenceInDays,
            });
          } else if (differenceInDays === 0) {
            todayList.push({
              id: communication._id,
              name: communication.companyName || "Unknown Company",
              communicationType: communication.communicationType,
              communicationDate: communication.communicationDate,
            });
          }
        });

        setOverdueCommunications(overdue);
        setDueToday(todayList);
      } catch (err) {
        console.error("Error fetching communications:", err.message);
      }
    };

    fetchCommunications();
  }, [refresh]); // Trigger fetch when `refresh` changes

  const totalOverdue = overdueCommunications.length;
  const totalDueToday = dueToday.length;

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <div className={`${styles.card} ${styles.overdue}`}>
          <h2>Overdue Communications</h2>
          <p>{totalOverdue}</p>
        </div>
        <div className={`${styles.card} ${styles.dueToday}`}>
          <h2>Due Today</h2>
          <p>{totalDueToday}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <h3>Overdue Communications</h3>
        {overdueCommunications.length > 0 ? (
          overdueCommunications.map((item) => (
            <div className={styles.gridItem} key={item.id}>
              <p>
                <strong>{item.name}</strong> ({item.communicationType})
              </p>
              <p>Last communication: {new Date(item.lastCommunication).toLocaleDateString()}</p>
              <p>{item.overdueDays} days overdue</p>
            </div>
          ))
        ) : (
          <p>No overdue communications</p>
        )}
      </div>

      <div className={styles.grid}>
        <h3>Today’s Communications</h3>
        {dueToday.length > 0 ? (
          dueToday.map((item) => (
            <div className={styles.gridItem} key={item.id}>
              <p>
                <strong>{item.name}</strong> ({item.communicationType})
              </p>
              <p>Task due today: {new Date(item.communicationDate).toLocaleTimeString()}</p>
            </div>
          ))
        ) : (
          <p>No tasks due today</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
