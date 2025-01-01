import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CalendarView.module.css";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [communications, setCommunications] = useState([]);

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/communications");
        setCommunications(response.data.data);
      } catch (err) {
        console.error("Error fetching communications:", err.message);
      }
    };

    fetchCommunications();
  }, []);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const getDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getHighlightClass = (dateKey) => {
    const commsForDate = communications.filter((comm) => comm.communicationDate.startsWith(dateKey));
    if (commsForDate.length === 0) return ""; // No communications, no highlight

    const todayKey = getDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    if (dateKey < todayKey) return styles.overdue; // Overdue communication
    if (dateKey === todayKey) return styles.today; // Communication due today

    return ""; // Default case
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className={styles.empty}></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateKey = getDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const commsForDay = communications.filter((comm) => comm.communicationDate.startsWith(dateKey));
      const isSelected = selectedDate && selectedDate.getDate() === day &&
                         selectedDate.getMonth() === currentDate.getMonth() &&
                         selectedDate.getFullYear() === currentDate.getFullYear();
      const highlightClass = getHighlightClass(dateKey);

      days.push(
        <div
          key={day}
          className={`${styles.day} ${highlightClass} ${isSelected ? styles.selected : ""}`}
          onClick={() => handleDayClick(day)}
        >
          <span>{day}</span>
          {commsForDay.length > 0 && (
            <ul className={styles.commsList}>
              {commsForDay.map((comm, index) => (
                <li key={index} className={styles.commDetails}>
                  {comm.communicationType} ({comm.companyName})
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    return days;
  };

  const renderCommunications = () => {
    if (!selectedDate) return null;
    const dateKey = getDateKey(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    const commsForDate = communications.filter((comm) => comm.communicationDate.startsWith(dateKey));

    return (
      <div className={styles.communications}>
        <h3>Communications for {selectedDate.toDateString()}</h3>
        {commsForDate.length > 0 ? (
          <ul>
            {commsForDate.map((comm, index) => (
              <li key={index}>
                <strong>{comm.communicationType}</strong> ({comm.companyName})
              </li>
            ))}
          </ul>
        ) : (
          <p>No communications for this date.</p>
        )}
      </div>
    );
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button className={styles.navButton} onClick={handlePrevMonth}>&lt;</button>
        <span className={styles.monthYear}>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </span>
        <button className={styles.navButton} onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className={styles.calendarGrid}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className={styles.dayName}>
            {dayName}
          </div>
        ))}
        {renderDays()}
      </div>
      {renderCommunications()}
    </div>
  );
};

export default CalendarView;
