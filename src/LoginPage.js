// LoginPage.js
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Import CSS file

const LoginPage = () => {
  useEffect(() => {
    // Fetch initial data
    fetchBikesData();
  }, []);

  const fetchBikesData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bikes");
      setBikesData(response.data);
    } catch (error) {
      console.error("Error fetching bikes data:", error);
    }
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bikesData, setBikesData] = useState([]);
  const [selectedBike, setSelectedBike] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
        selectedBike,
      });

      const { token } = response.data; // Assuming your server responds with a token
      localStorage.setItem("token", token); // Store token in local storage

      // Decode the token to get user details (example: employee name)
      const decodedToken = jwtDecode(token);

      // Redirect to dashboard with employee details
      navigate("/dashboard", { state: { employee: decodedToken } });
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleBikeId = async (e) => {
    setSelectedBike(e.target.value);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/postbikeId",
        {
          bikeId: e.target.value,
        }
      );
      console.log("Bike added successfully:");
      // Optionally, you can handle success state or update UI
    } catch (error) {
      console.error("Error adding bike:", error);
      // Handle error state or show error message to the user
    }
  };

  return (
    <div className="login-page">
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <h3>Select a Bike to Assemble:</h3>
        <select
          value={selectedBike}
          onChange={handleBikeId}
          className="bike-select"
          required
        >
          <option value="">Select Bike</option>
          {bikesData.map((bike) => (
            <option key={bike.id} value={bike.id}>
              {bike.name} - Assembly Time: {bike.assembly_time}
            </option>
          ))}
        </select>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LoginPage;
