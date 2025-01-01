import React, { useState, useEffect } from "react";
import styles from './Dashboard.module.css'; // Scoped CSS import

function Dashboard({ companies }) {
  const [companyComms, setCompanyComms] = useState({});

  // Fetch communications data for each company
  useEffect(() => {
    const fetchCompanyCommunications = async (companyId) => {
      try {
        const response = await fetch(`/api/companies/${companyId}/communications`);
        const data = await response.json();

        // Check if data is available and update state accordingly
        if (data.success) {
          setCompanyComms((prevState) => ({
            ...prevState,
            [companyId]: data,
          }));
        } else {
          console.error("Error fetching communications:", data.message);
        }
      } catch (err) {
        console.error("Error fetching company communications:", err);
      }
    };

    // Fetch communications for each company
    companies.forEach((company) => {
      fetchCompanyCommunications(company._id);  // Assuming company has an `_id` field
    });
  }, [companies]);

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <table className={styles.dashboardTable}>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Last Five Communications</th>
            <th>Next Scheduled Communication</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => {
            const companyData = companyComms[company._id] || {};
            const lastFiveComms = companyData.lastFiveComms || [];
            const nextComm = companyData.nextComm;

            return (
              <tr
                key={company._id}
                className={
                  company.isOverdue
                    ? styles.redHighlight
                    : company.isDueToday
                    ? styles.yellowHighlight
                    : ""
                }
              >
                <td>{company.companyName}</td>
                <td>
                  {lastFiveComms.length > 0 ? (
                    lastFiveComms.map((comm, index) => (
                      <div key={index}>
                        {comm.communicationType} ({new Date(comm.communicationDate).toLocaleDateString()})
                      </div>
                    ))
                  ) : (
                    <p>No recent communications</p>
                  )}
                </td>
                <td>
                  {nextComm ? (
                    `${nextComm.communicationType} (${new Date(nextComm.communicationDate).toLocaleDateString()})`
                  ) : (
                    "No scheduled communication"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
