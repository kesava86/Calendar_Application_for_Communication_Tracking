import axios from "axios";
import React, { useEffect, useState } from "react";
import MethodForm from "./MethodForm/MethodForm";
import styles from "./MethodsTable.module.css";

const MethodsTable = () => {
  const [methods, setMethods] = useState([]); // Store methods
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [showForm, setShowForm] = useState(false); // Form visibility
  const [selectedMethod, setSelectedMethod] = useState(null); // Track selected method for editing
  const [message, setMessage] = useState(""); // Success/Error message

  // Fetch methods data from backend
  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://calendar-application-for-communication-a7y1.onrender.com/api/methods");
      if (response.data.success && Array.isArray(response.data.data)) {
        setMethods(response.data.data);
      } else {
        setError("Unexpected response structure");
      }
    } catch (err) {
      console.error("Error fetching methods data:", err);
      setError("Error fetching methods data");
    } finally {
      setLoading(false);
    }
  };

  // Handle add or update method
  const handleMethodAdded = async (newMethod) => {
    if (selectedMethod) {
      // Update method in the state
      setMethods((prevMethods) =>
        prevMethods.map((method) =>
          method._id === newMethod._id ? newMethod : method
        )
      );
      setMessage("Method updated successfully!");
      await fetchMethods(); // Re-fetch methods after update to get the latest data
    } else {
      // Add new method to the state
      setMethods((prevMethods) => [...prevMethods, newMethod]);
      setMessage("Method added successfully!");
      await fetchMethods(); // Re-fetch methods after adding to get the latest data
    }

    setShowForm(false); // Close form after submission
    setSelectedMethod(null); // Reset selected method
  };

  // Toggle form visibility (Add new method or Edit existing method)
  const toggleForm = () => {
    setShowForm(!showForm);
    setSelectedMethod(null); // Reset selected method for new method
  };

  // Handle editing a method
  const handleEdit = (method) => {
    setSelectedMethod(method);
    setShowForm(true); // Show the form for editing
  };

  // Handle delete action
  const handleDelete = async (methodId) => {
    try {
      await axios.delete(`https://calendar-application-for-communication-a7y1.onrender.com/api/methods/${methodId}`);
      setMethods((prevMethods) =>
        prevMethods.filter((method) => method._id !== methodId)
      );
      setMessage("Method deleted successfully!");
      await fetchMethods(); // Re-fetch methods after deletion to get the latest data
    } catch (err) {
      console.error("Error deleting method:", err);
      setError("Failed to delete method. Please try again.");
    }
  };

  // If data is loading, show loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error fetching data, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {showForm ? (
        <MethodForm
          method={selectedMethod}
          onMethodAdded={handleMethodAdded}
          onCancel={() => setShowForm(false)} // Close form on cancel
        />
      ) : (
        <div className={styles.tableContainer}>
          <h2 className={styles.tableHeader}>Method Table</h2>
          {message && <div className={styles.message}>{message}</div>} {/* Success/Error message */}
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeaderCell}>Method Name</th>
                <th className={styles.tableHeaderCell}>Description</th>
                <th className={styles.tableHeaderCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {methods.length === 0 ? (
                <tr>
                  <td colSpan="3" className={styles.tableCell}>
                    No method data available.
                  </td>
                </tr>
              ) : (
                methods.map((method) => (
                  <tr key={method._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{method.name}</td>
                    <td className={styles.tableCell}>{method.description}</td>
                    <td className={styles.tableCell}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEdit(method)}
                      >
                        Edit
                      </button>
                      <button
  className={styles.deleteButton}  // Use the deleteButton class here
  onClick={() => handleDelete(method._id)}
>
  Delete
</button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MethodsTable;
