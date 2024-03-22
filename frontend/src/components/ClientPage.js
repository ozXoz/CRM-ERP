import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { getToken } from "../service/auth";
import "../css/SharedLayout.css";

const ENDPOINT = "http://localhost:3001";

function ClientPage() {
  const [clients, setClients] = useState([]);
  const [clientType, setClientType] = useState("");
  const [referenceData, setReferenceData] = useState([]);
  const [selectedReference, setSelectedReference] = useState("");

  useEffect(() => {
    // Initially fetch all clients
    console.log(referenceData);
    fetchClients();
  }, [referenceData]);

  useEffect(() => {
    // Fetch People or Companies based on clientType
    if (clientType) {
      fetchReferenceData(clientType);
    }
  }, [clientType]);

  const fetchClients = async () => {
    const token = getToken();
    try {
      const response = await axios.get(`${ENDPOINT}/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchReferenceData = async (type) => {
    const token = getToken();
    let url;
    
    // Determine the correct endpoint based on the clientType
    if (type === "People") {
      url = `${ENDPOINT}/people`; // Adjust if you have a specific endpoint for people
    } else if (type === "Company") {
      url = `${ENDPOINT}/companies`; // Use the updated endpoint for companies
    } else {
      console.error("Invalid client type selected");
      return; // Early return if an invalid type is detected
    }
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReferenceData(response.data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };
  

  const handleAddClient = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      const response = await axios.post(
        `${ENDPOINT}/clients/add`,
        {
          type: clientType,
          referenceId: selectedReference,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        fetchClients(); // Call fetchClients to update the client list
      }
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Client Management</h1>
        <p>Manage your clients here.</p>

        <form onSubmit={handleAddClient}>
          <select
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="People">People</option>
            <option value="Company">Company</option>
          </select>

          {clientType && (
            <select
              value={selectedReference}
              onChange={(e) => setSelectedReference(e.target.value)}
            >
              <option value="">Select {clientType}</option>
              {referenceData.map((data) => {
                // Display logic based on type
                const displayName =
                  clientType === "People"
                    ? `${data.firstName} ${data.lastName}`
                    : data.name;
                return (
                  <option key={data._id} value={data._id}>
                    {displayName}
                  </option>
                );
              })}
            </select>
          )}

          <button type="submit">Add Client</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Country</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.type}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.country}</td>
                <td>{client.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientPage;
