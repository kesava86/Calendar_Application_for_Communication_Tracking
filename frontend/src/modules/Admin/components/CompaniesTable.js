import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import styles from "./CompaniesTable.module.css"; // Import the CSS Module
import CompanyForm from "./CompanyForm"; // Import the CompanyForm component

const CompaniesTable = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch companies data from the backend
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/companies");
      if (Array.isArray(response.data.data)) {
        setCompanies(response.data.data);
      } else {
        setError("Unexpected response format");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setError("Error fetching company data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Handle Edit Button Click
  const handleEditClick = (company) => {
    setEditingCompany(company);
  };

  // Handle Delete Button Click
  const handleDeleteClick = async (companyId) => {
    try {
      await axios.delete(`http://localhost:5000/api/companies/${companyId}`);
      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company._id !== companyId)
      );
      setMessage("Company deleted successfully!");
    } catch (error) {
      console.error("Error deleting company:", error);
      setMessage(
        error.response?.data?.message || "Failed to delete company. Please try again."
      );
    }
  };

  // Handle Company Update
  const handleCompanyUpdated = async (updatedCompany) => {
    try {
      await axios.put(
        `http://localhost:5000/api/companies/${updatedCompany._id}`,
        updatedCompany
      );
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company._id === updatedCompany._id ? updatedCompany : company
        )
      );
      setEditingCompany(null);
      setMessage("Company updated successfully!");
    } catch (error) {
      console.error("Error updating company:", error);
      setMessage(
        error.response?.data?.message || "Failed to update company. Please try again."
      );
    }
  };

  // Render Companies Table
  const renderCompaniesTable = () => (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableHeader}>Company Table</h2>
      {message && <div className={styles.message}>{message}</div>}
      {/* Wrap the table in a scrollable wrapper */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeaderCell}>Company Name</th>
              <th className={styles.tableHeaderCell}>Location</th>
              <th className={styles.tableHeaderCell}>LinkedIn</th>
              <th className={styles.tableHeaderCell}>Emails</th>
              <th className={styles.tableHeaderCell}>Phone Numbers</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.tableCell}>
                  No company data available.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company._id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{company.companyName}</td>
                  <td className={styles.tableCell}>{company.location}</td>
                  <td className={styles.tableCell}>
                    <a
                      href={company.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {company.linkedin}
                    </a>
                  </td>
                  <td className={styles.tableCell}>{company.emails}</td>
                  <td className={styles.tableCell}>{company.phoneNumbers}</td>
                  <td className={styles.tableCell}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleEditClick(company)}
                    >
                      Edit
                    </button>
                    <button
  className={styles.deleteButton}  // Use the deleteButton class here
  onClick={() => handleDeleteClick(company._id)}
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
    </div>
  );

  // Show loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  // Conditional rendering: Show table or editing form
  return (
    <div>
      {editingCompany ? (
        <CompanyForm
          initialData={editingCompany}
          onCompanyUpdated={handleCompanyUpdated}
          onCancel={() => setEditingCompany(null)} // Exit edit mode
        />
      ) : (
        renderCompaniesTable()
      )}
    </div>
  );
};

export default CompaniesTable;
