import React, { useState, useEffect } from 'react';
import DataInputScreen from './components/DataInputScreen';
import SensorCard from './components/SensorCard';
import Swal from 'sweetalert2';

import './App.css';

function App() {
  const [sensorArray, setSensorArray] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showInputScreen, setShowInputScreen] = useState(true);
  const [refreshRate, setRefreshRate] = useState(5000);

  const handleSaveData = (array, token) => {
    // Show the toast first
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      icon: 'success',
      title: 'Your settings have been saved.',
    }).then((result) => {
      // After the toast, save to local storage and update the state
      localStorage.setItem('sensorArray', JSON.stringify(array));
      localStorage.setItem('accessToken', token);
      setSensorArray(array);
      setAccessToken(token);
      setShowInputScreen(false); // Change the view after saving data
    });
  };

  const handleGlobalRefresh = () => {
    setIsLoading(true); // Start loading
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to trigger refresh
    setTimeout(() => setIsLoading(false), 500); // Stop loading after a delay
  };

  useEffect(() => {
    // Load data from localStorage
    const storedSensorArray = localStorage.getItem('sensorArray');
    const storedAccessToken = localStorage.getItem('accessToken');

    if (storedSensorArray && storedAccessToken) {
      setSensorArray(JSON.parse(storedSensorArray));
      setAccessToken(storedAccessToken);
      setShowInputScreen(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) handleGlobalRefresh();
    }, refreshRate);
    return () => clearInterval(interval);
  }, [isLoading, refreshRate]);

  const handleRefreshRateChange = (e) => {
    setRefreshRate(Number(e.target.value));
  };

  const handleClearSettings = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to clear the current settings and enter new ones?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear settings!',
      customClass: {
        container: 'dark-mode-swal',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('sensorArray'); // Clear sensor array from local storage
        localStorage.removeItem('accessToken'); // Clear access token from local storage
        setSensorArray(null);
        setAccessToken(null);
        setShowInputScreen(true); // Show the input screen
      }
    });
  };

  // ====================================================
  // RENDERING
  // ====================================================

  if (showInputScreen) {
    return <DataInputScreen onSave={handleSaveData} />;
  }

  return (
    <div className="App bg-dark">
      <div className="header-area d-flex justify-content-between align-items-center mb-3 pt-3">
        <div className="d-flex align-items-center">
          <img
            src="./fh-logo.jpg"
            className="img-fluid rounded"
            alt="FH-Logo"
            style={{ maxWidth: '50px', marginRight: '10px' }}
          />
          <div>
            <h4 style={{ marginBottom: '5px' }}>Dataskop Sensor Debugging</h4>
            <h5>Live tracking &nbsp;&nbsp; <span style={{ fontSize: '0.6em' }}>
              © FHStp (
              <a
                href="https://icmt.fhstp.ac.at/team/florian-grassinger"
                className="link-light"
                target="_blank"
              >
                me
              </a>
              )
            </span></h5>

          </div>
        </div>
        <div className="text-center">
          <div>
            <label htmlFor="refreshRate" className="form-label">
              Current refresh rate:
            </label>
            <input
              id="refreshRate"
              type="number"
              className="form-control"
              value={refreshRate}
              onChange={handleRefreshRateChange}
              min="1000"
              max="9999"
              step="1000"
              style={{
                margin: '0px 5px',
                width: '75px',
                display: 'inline-block',
                backgroundColor: '#212529',
                color: 'white',
                border: '1px solid #343a40',
              }}
            />
            ms
          </div>
          <button
            className={`btn mt-2 ${
              isLoading ? 'btn-outline-warning' : 'btn-light'
            }`}
            onClick={handleGlobalRefresh}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh 🔄'}
          </button>
        </div>
        <div>
          <button className="btn btn-danger" onClick={handleClearSettings}>
            🗑️ Clear Settings
          </button>
        </div>
      </div>
      <hr />

      <div className="container bg-dark text-white">
        <div className="row">
          {sensorArray.map((path, index) => (
            <SensorCard
              key={index}
              sensorName={path.sensorName}
              apiPath={path.url}
              accessToken={accessToken}
              refreshKey={refreshKey}
              boxColor={path.boxColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
