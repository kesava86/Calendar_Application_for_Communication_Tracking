// src/services/companyService.js
export const addCompany = async (companyData) => {
    const response = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    });
    return response.json();
  };
  