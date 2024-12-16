import React, { useState } from "react";
import "../src/App.css";

function SystemConfigurationForm({ resetGraph }) {
  const [formData, setFormData] = useState({
    totalTicketCount: "",
    ticketReleaseRate: "",
    customerRetrieveRate: "",
    maxTicketCapacity: "",
    numberOfVendors: "",
    numberOfCustomers: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      totalTicketCount: "",
      ticketReleaseRate: "",
      customerRetrieveRate: "",
      maxTicketCapacity: "",
      numberOfVendors: "",
      numberOfCustomers: "",
    });
    setError("");
  };

  const validateForm = () => {
    const {
      totalTicketCount,
      ticketReleaseRate,
      customerRetrieveRate,
      maxTicketCapacity,
      numberOfVendors,
      numberOfCustomers,
    } = formData;

    if (
        !totalTicketCount ||
        !ticketReleaseRate ||
        !customerRetrieveRate ||
        !maxTicketCapacity ||
        !numberOfVendors ||
        !numberOfCustomers
    ) {
      setError("All fields are required.");
      return false;
    }

    if (
        totalTicketCount <= 0 ||
        ticketReleaseRate <= 0 ||
        customerRetrieveRate <= 0 ||
        maxTicketCapacity <= 0 ||
        numberOfVendors <= 0 ||
        numberOfCustomers <= 0
    ) {
      setError("Values must be greater than 0.");
      return false;
    }

    setError("");
    return true;
  };

  const handleStart = () => {
    if (!validateForm()) return;

    const url = `http://localhost:3000?totalTicketCount=${formData.totalTicketCount}&ticketReleaseRate=${formData.ticketReleaseRate}&customerRetrieveRate=${formData.customerRetrieveRate}&maxTicketCapacity=${formData.maxTicketCapacity}&numberOfVendors=${formData.numberOfVendors}&numberOfCustomers=${formData.numberOfCustomers}`;
    console.log("Fetch URL: ", url);
    fetch(url)
        .then((res) => res.text())
        .then((text) => {
          if (text === "System already running...") {
            console.log(text);
          } else {
            resetGraph();
          }
        })
        .catch((error) => {
          console.error(error);
          setError("Failed to start the system. Please try again.");
        });
  };

  const handleStop = () => {
    fetch("http://localhost:3000/stop")
        .then((res) => res.text())
        .then((text) => console.log(text))
        .catch((error) => {
          console.error(error);
          setError("Failed to stop the system. Please try again.");
        });
  };

  return (
      <div className="config-form" style={{ width: "25%", marginLeft: "1%", marginRight: "1%", marginTop: "2%" }}>
        <center>
          <h4>Configuration Form</h4>
        </center>
        <br />
        {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </div>
        )}
        <div className="form-floating mb-3">
          <input
              type="number"
              className="form-control"
              name="totalTicketCount"
              value={formData.totalTicketCount}
              onChange={handleInputChange}
              placeholder="Total Ticket Count"
              min={1}
          />
          <label htmlFor="floatingInput">Total Ticket Count</label>
        </div>

        <div className="form-floating mb-3">
          <input
              type="number"
              className="form-control"
              name="ticketReleaseRate"
              value={formData.ticketReleaseRate}
              onChange={handleInputChange}
              placeholder="Ticket Release Rate"
              min={1}
          />
          <label htmlFor="floatingInput">Ticket Release Rate</label>
        </div>

        <div className="form-floating mb-3">
          <input
              type="number"
              className="form-control"
              name="customerRetrieveRate"
              value={formData.customerRetrieveRate}
              onChange={handleInputChange}
              placeholder="Customer Retrieve Rate"
              min={1}
          />
          <label htmlFor="floatingInput">Customer Retrieve Rate</label>
        </div>

        <div className="form-floating mb-3">
          <input
              type="number"
              className="form-control"
              name="maxTicketCapacity"
              value={formData.maxTicketCapacity}
              onChange={handleInputChange}
              placeholder="Max Ticket Capacity"
              min={1}
          />
          <label htmlFor="floatingInput">Max Ticket Capacity</label>
        </div>

        <div className="form-floating mb-3">
          <input
              type="number"
              className="form-control"
              name="numberOfVendors"
              value={formData.numberOfVendors}
              onChange={handleInputChange}
              placeholder="Number of Vendors"
              min={1}
          />
          <label htmlFor="floatingInput">Number of Vendors</label>
        </div>

        <div className="form-floating mb-3">
          <input
              type="number"
              className="form-control"
              name="numberOfCustomers"
              value={formData.numberOfCustomers}
              onChange={handleInputChange}
              placeholder="Number of Customers"
              min={1}
          />
          <label htmlFor="floatingInput">Number of Customers</label>
        </div>

        <button className="btn btn-success" onClick={handleStart}>Start System</button>
        <button className="btn btn-danger" onClick={handleStop}>Stop System</button>
        <button className="btn btn-warning" onClick={handleReset}>Reset</button>
      </div>
  );
}

export default SystemConfigurationForm;
