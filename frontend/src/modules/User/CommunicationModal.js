import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CommunicationModal.module.css";

export const CommunicationModal = ({ communication, onSubmit, onCancel }) => {
  const [communicationData, setCommunicationData] = useState({
    communicationType: "",
    communicationDate: "",
    notes: "",
    companyId: "",
  });

  const [companies, setCompanies] = useState([]); // To store the list of companies
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Pre-fill form with existing communication data if editing
  useEffect(() => {
    if (communication) {
      setCommunicationData({
        communicationType: communication.communicationType || "",
        communicationDate: communication.communicationDate || "",
        notes: communication.notes || "",
        companyId: communication.companyId || "",
      });
    }
  }, [communication]);

  // Fetch companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("https://calendar-application-for-communication-a7y1.onrender.com/api/companies");
        if (response.data && response.data.data) {
          setCompanies(response.data.data);
        } else {
          setError("Unable to fetch companies. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching companies:", err.message);
        setError("Error fetching companies. Check your server connection.");
      }
    };
    fetchCompanies();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommunicationData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !communicationData.communicationType ||
      !communicationData.communicationDate ||
      !communicationData.notes ||
      !communicationData.companyId
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const url = communication
        ? `https://calendar-application-for-communication-a7y1.onrender.com/api/communications/${communication._id}`
        : "https://calendar-application-for-communication-a7y1.onrender.com/api/communications";

      const response = communication
        ? await axios.put(url, communicationData)
        : await axios.post(url, communicationData);

      if (response.status === 200 || response.status === 201) {
        setMessage("Communication logged successfully!");
        setError("");

        if (onSubmit) {
          onSubmit(response.data);
        }

        // Close modal after successful submission
        if (onCancel) onCancel();
      } else {
        setError("Unexpected server response. Please try again.");
      }
    } catch (err) {
      console.error("Error logging communication:", err.message);
      setError(
        err.response?.data?.message ||
          "Error logging communication. Please check your input and try again."
      );
      setMessage("");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.formHeader}>
        {communication ? "Edit Communication" : "Add Communication"}
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <label className={styles.label}>Company:</label>
          <select
            name="companyId"
            value={communicationData.companyId}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>Communication Type:</label>
          <select
            name="communicationType"
            value={communicationData.communicationType}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Select Type</option>
            <option value="LinkedIn Post">LinkedIn Post</option>
            <option value="Email">Email</option>
            <option value="Call">Call</option>
          </select>
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>Communication Date:</label>
          <input
            type="date"
            name="communicationDate"
            value={communicationData.communicationDate}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>Notes:</label>
          <textarea
            name="notes"
            value={communicationData.notes}
            onChange={handleChange}
            className={styles.textarea}
            required
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.button}>
            {communication ? "Update Communication" : "Add Communication"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {message && <div className={styles.successMessage}>{message}</div>}
    </div>
  );
};

export default CommunicationModal;
