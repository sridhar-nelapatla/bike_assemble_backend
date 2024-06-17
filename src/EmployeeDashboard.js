import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "./Chart";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [bikesData, setBikesData] = useState([]);
  const [employeeProduction, setEmployeeProduction] = useState([]);
  const [specficDateProd, setSpecficDateProd] = useState([]);
  const [specificDateChange, setSpecificDateChange] = useState("");
  const [selectedBikeAssembled, setSelectedBikeAssembled] = useState([]);
  const [specifiedBikeAssembled, setSpecifiedBikeAssembled] = useState([]);
  const [selectedBikeAssembledpopup, setSelectedBikeAssembledpopup] =
    useState(false);
  const [specifiedBikeAssembledpopup, setSpecifiedBikeAssembledpopup] =
    useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { employee } = location.state || {};

  useEffect(() => {
    fetchBikesData();
  }, []);

  const fetchEmployeeProduction = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employee/production",
        { params: { fromDate, toDate } }
      );
      setEmployeeProduction(response.data);
      setSelectedBikeAssembledpopup(true);
    } catch (error) {
      console.error("Error fetching employee production:", error);
    }
  };

  const fetchEmployeeProductionForSpecificDate = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employee/specificDateProduction",
        { params: { specificDate: specificDateChange } }
      );
      setSpecficDateProd(response.data);
      setSpecifiedBikeAssembledpopup(true);
    } catch (error) {
      console.error(
        "Error fetching employee production for specific date:",
        error
      );
    }
  };

  const fetchBikesData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bikes");
      setBikesData(response.data);
    } catch (error) {
      console.error("Error fetching bikes data:", error);
    }
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleSpecificDateChange = (e) => {
    setSpecificDateChange(e.target.value);
  };

  const timeToMinutes = (timeString) => {
    if (!timeString) return 0;

    const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
    const hours = parseInt(hoursStr, 10) || 0;
    const minutes = parseInt(minutesStr, 10) || 0;
    const seconds = parseInt(secondsStr, 10) || 0;

    return hours * 60 + minutes + seconds / 60;
  };

  useEffect(() => {
    const assembledBikes = bikesData.map((bike) => {
      const production = employeeProduction.find(
        (prod) => prod.bike_id === bike.id
      );
      if (production) {
        const loggedDurationMinutes = timeToMinutes(
          production.total_logged_duration
        );
        const assemblyTimeMinutes = timeToMinutes(bike.assembly_time);
        return {
          id: bike.id,
          name: bike.name,
          assembledCount: loggedDurationMinutes / assemblyTimeMinutes,
        };
      } else {
        return {
          id: bike.id,
          name: bike.name,
          assembledCount: 0,
        };
      }
    });
    setSelectedBikeAssembled(assembledBikes);
  }, [employeeProduction, bikesData, selectedBikeAssembledpopup]);

  useEffect(() => {
    const assembledBikes = bikesData.map((bike) => {
      const production = specficDateProd.find(
        (prod) => prod.bike_id === bike.id
      );
      if (production) {
        const loggedDurationMinutes = timeToMinutes(
          production.total_logged_duration
        );
        const assemblyTimeMinutes = timeToMinutes(bike.assembly_time);
        return {
          id: bike.id,
          name: bike.name,
          assembledCount: loggedDurationMinutes / assemblyTimeMinutes,
        };
      } else {
        return {
          id: bike.id,
          name: bike.name,
          assembledCount: 0,
        };
      }
    });
    setSpecifiedBikeAssembled(assembledBikes);
  }, [specficDateProd, bikesData, specifiedBikeAssembledpopup]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {
        employeeId: employee?.id,
        employeeRole: employee?.role,
      });
      localStorage.removeItem("token");
      navigate("/", { state: { employee: null } });
      console.log("Logout successful.");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="welcome-message">
        Welcome,{" "}
        {employee.role === "employee" ? (
          <span>{`${employee?.username} please assemble the bike parts`}</span>
        ) : (
          <span>{employee?.username}</span>
        )}
      </h2>

      {employee?.role === "admin" && (
        <>
          <div className="filter-section">
            <label>From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="date-input"
            />
            <label>To:</label>
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="date-input"
            />
            <button onClick={fetchEmployeeProduction} className="filter-button">
              Filter
            </button>
          </div>

          <div className="specific-date-section">
            <label>Specific Date:</label>
            <input
              type="date"
              value={specificDateChange}
              onChange={handleSpecificDateChange}
              className="date-input"
            />
            <button
              onClick={fetchEmployeeProductionForSpecificDate}
              className="fetch-button"
            >
              Fetch Production
            </button>
          </div>
        </>
      )}

      {/* Conditional rendering of Chart component based on selectedChartData */}
      {selectedBikeAssembledpopup && (
        <>
          <h3>Number of Bikes assembled on a selected date/time:</h3>
          <div className="chart-container">
            <Chart data={selectedBikeAssembled} />
          </div>
        </>
      )}
      {specifiedBikeAssembledpopup && (
        <>
          <h3>Employee production on a specific date:</h3>
          <div className="chart-container">
            <Chart data={specifiedBikeAssembled} />
          </div>
        </>
      )}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};
export default EmployeeDashboard;
