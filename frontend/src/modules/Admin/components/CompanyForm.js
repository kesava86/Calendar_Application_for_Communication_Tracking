import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CompanyForm.module.css";

const CompanyForm = ({
  initialData = null, // Pre-filled data for edit mode
  onCompanyAdded,
  onCompanyUpdated,
  onCancel,
}) => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    location: "",
    linkedin: "",
    emails: "",
    phoneNumbers: "",
    comments: "",
    periodicity: "14", // Default to 14 days (2 weeks)
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form data if initialData is provided
  useEffect(() => {
    if (initialData) {
      setCompanyData(initialData);
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData) {
        // Update existing company (Edit Mode)
        await axios.put(
          `https://calendar-application-for-communication-a7y1.onrender.com/api/companies/${companyData._id}`,
          companyData
        );
        setMessage("Company updated successfully!");
        onCompanyUpdated(companyData); // Notify parent about the update
      } else {
        // Add new company (Add Mode)
        const response = await axios.post(
          "https://calendar-application-for-communication-a7y1.onrender.com/api/companies",
          companyData
        );
        setMessage(response.data.message || "Company added successfully!");
        onCompanyAdded(); // Notify parent about the addition
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setMessage("Error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formHeader}>
        {initialData ? "Edit Company" : "Add Company"}
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="companyName" className={styles.formLabel}>
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            className={styles.formInput}
            value={companyData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.formLabel}>
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className={styles.formInput}
            value={companyData.location}
            onChange={handleChange}
            placeholder="Enter location"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="linkedin" className={styles.formLabel}>
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            className={styles.formInput}
            value={companyData.linkedin}
            onChange={handleChange}
            placeholder="Enter LinkedIn URL"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="emails" className={styles.formLabel}>
            Emails
          </label>
          <input
            type="email"
            id="emails"
            name="emails"
            className={styles.formInput}
            value={companyData.emails}
            onChange={handleChange}
            placeholder="Enter email addresses"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumbers" className={styles.formLabel}>
            Phone Numbers
          </label>
          <input
            type="text"
            id="phoneNumbers"
            name="phoneNumbers"
            className={styles.formInput}
            value={companyData.phoneNumbers}
            onChange={handleChange}
            placeholder="Enter phone numbers"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="comments" className={styles.formLabel}>
            Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            className={styles.formTextArea}
            value={companyData.comments}
            onChange={handleChange}
            placeholder="Add any comments"
            rows="4"
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="periodicity" className={styles.formLabel}>
            Communication Periodicity (1–14 days)
          </label>
          <select
            id="periodicity"
            name="periodicity"
            className={styles.formInput}
            value={companyData.periodicity}
            onChange={handleChange}
            required
          >
            {Array.from({ length: 14 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? "day" : "days"}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? initialData
                ? "Updating..."
                : "Submitting..."
              : initialData
              ? "Update"
              : "Submit"}
          </button>
          {onCancel && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default CompanyForm;
