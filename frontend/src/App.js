import React, { useEffect, useState } from "react";
import ConfigForm from "./SystemConfigurationForm.js";
import { Line } from "react-chartjs-2";
import "../src/App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function App() {
  const [data, setData] = useState([0, 0, 0, 0, {}, {}]);
  const [timeData, setTimeData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const vendors = JSON.parse(event.data);
      setData(vendors);

      const totalSales = vendors[1] - vendors[2];
      setTimeData((prev) => [
        ...prev,
        { time: new Date().toLocaleTimeString(), sales: totalSales },
      ]);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
      setError("Network error. Please try again later.");
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const chartData = {
    labels: timeData.map((entry) => entry.time),
    datasets: [
      {
        label: "Sale Ticket Count",
        data: timeData.map((entry) => entry.sales),
        borderColor: "black",
        backgroundColor: "lightblue",
        fill: true,
      },
    ],
  };

  const resetGraph = () => {
    setTimeData([]);
  };

  return (
      <div style={{ backgroundColor: "rgb(255,255,255)" }}>
        <link
            rel="icon"
            type="image/x-icon"
            href="https://www.pngkey.com/detail/u2q8e6q8w7e6o0r5_ticketing-system-icon-green-ticket-icon-png"
        ></link>

        <div id="title-webapp">
          <h1>TicketFlow Management System</h1>
        </div>

        {error && (
            <div style={{ color: "red", textAlign: "center" }}>
              <strong>{error}</strong>
            </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ConfigForm resetGraph={resetGraph} />

          <div style={{ display: "flex", marginTop: "2%", width: "80%" }}>
            <div
                className="chart"
                style={{
                  width: "45%",
                  marginRight: "5%",
                  height: "400px",
                }}
            >
              <center>
                <h4>Real-Time Sale Chart</h4>
              </center>
              <br />
              <Line data={chartData} />
            </div>

            <div
                className="summary"
                style={{
                  width: "45%",
                  height: "auto",
                  textAlign: "center",
                  backgroundColor: "rgba(168,241,110,0.8)",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
            >
              <h4>Ticket Summary</h4>
              <table className="summary-table" style={{ marginTop: "10px", width: "100%" }}>
                <tbody>
                <tr>
                  <td>Total Ticket Count</td>
                  <td> : {data[0]}</td>
                </tr>
                <tr>
                  <td>Maximum Ticket Capacity</td>
                  <td> : {data[3]}</td>
                </tr>
                <tr>
                  <td>Total Add Ticket Count</td>
                  <td> : {data[1]}</td>
                </tr>
                <tr>
                  <td>Total Sale Ticket Count</td>
                  <td> : {data[1] - data[2]}</td>
                </tr>
                <tr>
                  <td>Remaining Ticket Count</td>
                  <td> : {data[2]}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
