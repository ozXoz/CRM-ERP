import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { getToken } from '../service/auth';
import '../css/SharedLayout.css';

const ENDPOINT = 'http://localhost:3001/api/tax-rates';

function TaxPage() {
  const [taxRates, setTaxRates] = useState([]);
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [totalTaxRate, setTotalTaxRate] = useState('');

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const fetchTaxRates = async () => {
    try {
      const response = await axios.get(ENDPOINT, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setTaxRates(response.data);
    } catch (error) {
      console.error('Error fetching tax rates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(ENDPOINT, {
        country,
        province,
        totalTaxRate,
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setTaxRates([...taxRates, response.data]);
      setCountry('');
      setProvince('');
      setTotalTaxRate('');
    } catch (error) {
      console.error('Error adding tax rate:', error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Tax Rates</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Total Tax Rate"
            value={totalTaxRate}
            onChange={(e) => setTotalTaxRate(e.target.value)}
            required
          />
          <button type="submit">Add Tax Rate</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Province</th>
              <th>Total Tax Rate %</th>
            </tr>
          </thead>
          <tbody>
            {taxRates.map((taxRate) => (
              <tr key={taxRate._id}>
                <td>{taxRate.country}</td>
                <td>{taxRate.province}</td>
                <td>{taxRate.totalTaxRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaxPage;
