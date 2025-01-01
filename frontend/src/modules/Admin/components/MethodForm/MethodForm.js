import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MethodForm.module.css";

const MethodForm = ({ method, onMethodAdded, onFormSubmit, onCancel }) => {
  const [methodData, setMethodData] = useState({
    name: "LinkedIn Post",
    description: "",
    sequence: 1,
    mandatory: false,
  });

  useEffect(() => {
    if (method) {
      setMethodData({
        name: method.name,
        description: method.description,
        sequence: method.sequence,
        mandatory: method.mandatory,
      });
    }
  }, [method]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const communicationMethods = [
    "LinkedIn Post",
    "LinkedIn Message",
    "Email",
    "Phone Call",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMethodData({ ...methodData, [name]: type === "checkbox" ? checked : value });
  };

  const handleCheckboxToggle = () => {
    setMethodData({ ...methodData, mandatory: !methodData.mandatory });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!methodData.name || !methodData.description || methodData.sequence === "") {
      setError("Please fill out all the required fields.");
      return;
    }

    try {
      const url = method ? `http://localhost:5000/api/methods/${method._id}` : "http://localhost:5000/api/methods";
      const methodRequest = method ? axios.put(url, methodData) : axios.post(url, methodData);
      const response = await methodRequest;

      setMessage("Communication Method saved successfully!");
      setError("");
      if (onMethodAdded) onMethodAdded(response.data);

      onFormSubmit(); // Show methods table
    } catch (error) {
      console.error("Error saving method:", error);
      setMessage("Error saving method. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.formHeader}>{method ? "Edit Method" : "Add Communication Method"}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <label className={styles.label}>Communication Method:</label>
          <select
            name="name"
            value={methodData.name}
            onChange={handleChange}
            className={styles.select}
          >
            {communicationMethods.map((method, index) => (
              <option key={index} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>Description:</label>
          <textarea
            name="description"
            value={methodData.description}
            onChange={handleChange}
            className={styles.textarea}
            required
          />
        </div>
        <div className={styles.formRow}>
  <label className={styles.label}>Sequence Order:</label>
  <select
    name="sequence"
    value={methodData.sequence}
    onChange={handleChange}
    className={styles.select}
    required
  >
    {communicationMethods.map((_, index) => (
      <option key={index + 1} value={index + 1}>
        {index + 1}
      </option>
    ))}
  </select>
</div>
        <div className={styles.formRow}>
          <div className={styles.checkboxWrapper}>
            <label className={styles.checkboxText}>Mandatory:</label>
            <div
              className={`${styles.checkbox} ${methodData.mandatory ? styles.checked : ""}`}
              onClick={handleCheckboxToggle}
              tabIndex={0}
            ></div>
          </div>
        </div>
        <div className={styles.formActions}>
  <button type="submit" className={styles.button}>
    {method ? "Update Method" : "Add Method"}
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

export default MethodForm;
