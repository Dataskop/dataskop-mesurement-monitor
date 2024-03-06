import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'bootstrap';
import SensorForm from './SensorForm';
import Swal from 'sweetalert2';

import './DataInputScreen.css';

const DataInputScreen = ({ onSave }) => {
  const [sensors, setSensors] = useState([{}]);
  const [accessToken, setAccessToken] = useState('');
  const [currentSessionIndex, setCurrentSessionIndex] = useState(null);
  const [sessionsHistory, setSessionsHistory] = useState(() => {
    const savedSessions = localStorage.getItem('sessionsHistory');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  const [maxValuesCount, setMaxValuesCount] = useState(() => {
    return parseInt(localStorage.getItem('maxValuesCount')) || 20;
  });

  const handleSettingsClick = () => {
    Swal.fire({
      title: 'Settings',
      input: 'number',
      inputLabel: 'The maximum amount of values that should be kept when using NOT the "advanced" sensor path. The sensor values get accumulated over time. This amount specifies how many values are shown at once.',
      inputValue: maxValuesCount,
      inputAttributes: {
        min: 1,
        step: 1,
      },
      customClass: {
        container: 'dark-mode-swal',
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: (newValue) => {
        const parsedValue = parseInt(newValue, 10);
        if (!parsedValue || parsedValue < 1) {
          Swal.showValidationMessage(`Invalid count: ${newValue}`);
          return false;
        }
        return parsedValue;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setMaxValuesCount(result.value);
        localStorage.setItem('maxValuesCount', result.value.toString());
      }
    });
  };

  const handleSensorChange = (index) => (updatedSensor) => {
    const newSensors = [...sensors];
    newSensors[index] = updatedSensor;
    setSensors(newSensors);
  };

  const handleAddSensor = () => {
    setSensors([...sensors, {}]);
  };

  const handleRemoveSensor = (index) => () => {
    // Hide the tooltip
    const sensorElement = document.getElementById(`remove-sensor-${index}`);
    if (sensorElement) {
      const tooltip = Tooltip.getInstance(sensorElement);
      if (tooltip) {
        tooltip.hide();
      }
    }

    // Remove the sensor
    const newSensors = [...sensors];
    newSensors.splice(index, 1);
    setSensors(newSensors);
  };

  const handleStartNewSession = () => {
    // Reset sensors and accessToken for a new session
    setSensors([{}]);
    setAccessToken('');
    setCurrentSessionIndex(null); // Reset the current session index
  };

  const handleSave = () => {
    // Check if the accessToken is set
    if (!accessToken) {
      Swal.fire({
        title: 'Error!',
        text: 'Access token is required.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'dark-mode-swal',
        },
      });
      return;
    }

    // Check if at least one sensor path is set
    if (!sensors.some((sensor) => sensor.url)) {
      Swal.fire({
        title: 'Error!',
        text: 'At least one sensor path is required.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'dark-mode-swal',
        },
      });
      return;
    }

    const currentSession =
      currentSessionIndex !== null
        ? sessionsHistory[currentSessionIndex]
        : null;

    const promptForSessionNameAndSave = () => {
      Swal.fire({
        title: 'Enter a name for this session',
        input: 'text',
        inputPlaceholder: 'Session name',
        showCancelButton: true,
        background: '#212529',
        color: '#FFFFFF',
        confirmButtonColor: '#FFA500',
        cancelButtonColor: '#6c757d',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!';
          }
        },
      }).then((result) => {
        if (result.value) {
          updateSessionHistory(result.value);
        }
      });
    };

    const updateSessionHistory = (sessionName) => {
      const newSession = {
        name: sessionName,
        sensors,
        accessToken,
        timestamp: new Date().toISOString(),
      };

      let newSessionsHistory;
      if (currentSessionIndex !== null) {
        // Update existing session
        newSessionsHistory = sessionsHistory.map((session, index) =>
          index === currentSessionIndex ? newSession : session
        );
      } else {
        // Add new session
        newSessionsHistory = [newSession, ...sessionsHistory].slice(0, 5);
      }

      setSessionsHistory(newSessionsHistory);
      localStorage.setItem(
        'sessionsHistory',
        JSON.stringify(newSessionsHistory)
      );

      // Proceed with onSave
      onSave(sensors, accessToken);
    };

    if (currentSession && currentSession.name) {
      // If the current session already has a name, proceed without prompting for a new name
      updateSessionHistory(currentSession.name);
    } else {
      // New session or unnamed session, prompt for a name
      promptForSessionNameAndSave();
    }
  };

  window.handleLoadSession = (index) => {
    const session = sessionsHistory[index];
    if (session) {
      setSensors(session.sensors);
      setAccessToken(session.accessToken);
      setCurrentSessionIndex(index); // Update the current session index
      Swal.close();
    }
  };

  const sessionsHistoryRef = useRef(sessionsHistory);
  sessionsHistoryRef.current = sessionsHistory;

  const updateSessionsHistory = (sessionName) => {
    const newSession = {
      name: sessionName,
      sensors,
      accessToken,
      timestamp: new Date().toISOString(),
    };

    let newSessionsHistory;
    if (currentSessionIndex !== null) {
      // Update existing session
      newSessionsHistory = sessionsHistory.map((session, index) =>
        index === currentSessionIndex ? newSession : session
      );
    } else {
      // Add new session
      newSessionsHistory = [newSession, ...sessionsHistory].slice(0, 15);
    }

    setSessionsHistory(newSessionsHistory);
    localStorage.setItem('sessionsHistory', JSON.stringify(newSessionsHistory));

    // Proceed with onSave
    onSave(sensors, accessToken);
  };

  const generateHistoryHtml = (sessions) => {
    return `
      <p>
        <small>This table shows the latest 15 session you worked on.</small>
      </p>
      <table class="table table-dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sessions
            .map(
              (session, index) => `
            <tr>
              <td>${session.name}</td>
              <td>${new Date(session.timestamp).toLocaleString()}</td>
              <td>
                <button class="btn btn-secondary" onclick="handleLoadSession(${index})">Load</button>
                <button class="btn btn-danger" onclick="handleRemoveSession(${index})">🗑️</button>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  };

  window.handleRemoveSession = (index) => {
    // Create a new array without the session at the given index
    const updatedSessions = sessionsHistoryRef.current.filter(
      (_, i) => i !== index
    );

    // Update the state and localStorage
    setSessionsHistory(updatedSessions);
    localStorage.setItem('sessionsHistory', JSON.stringify(updatedSessions));

    // If the current session is the one being removed, reset the current session index
    if (currentSessionIndex === index) {
      setCurrentSessionIndex(null);
    } else if (currentSessionIndex > index) {
      // Adjust the current session index if a previous session was removed
      setCurrentSessionIndex(currentSessionIndex - 1);
    }

    // Update the content of the SweetAlert2 modal to reflect the changes
    Swal.update({
      html: generateHistoryHtml(updatedSessions),
    });
  };

  const handleViewHistory = () => {
    Swal.fire({
      title: 'Session History',
      html: generateHistoryHtml(sessionsHistory),
      customClass: {
        container: 'dark-mode-swal',
      },
      preConfirm: () => {
        return sessionsHistory;
      },
    });
  };

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
  }, [sensors]);

  useEffect(() => {
    sessionsHistoryRef.current = sessionsHistory;
  }, [sessionsHistory]);

  return (
    <div className="container pt-5 data-input-screen-wrapper">
      <button className="history-button" onClick={handleViewHistory}>
        🕒
      </button>
      <button className="settings-button" onClick={handleSettingsClick}>
        ⚙️
      </button>
      <div
        className="sensor-forms-container"
        style={{ maxHeight: '45vh', overflowY: 'scroll' }}
      >
        <h3>Current Sensorpaths</h3>
        {sensors.map((sensor, index) => (
          <SensorForm
            key={index}
            sensor={sensor}
            onSensorChange={handleSensorChange(index)}
            onRemove={handleRemoveSensor(index)}
            index={index}
          />
        ))}
      </div>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-center align-items-center my-3">
          <h5>Add sensor path:&nbsp;&nbsp;</h5>
          <button
            className="btn"
            style={{ backgroundColor: '#FFA500' }}
            onClick={handleAddSensor}
          >
            ➕
          </button>
        </div>
      </div>
      <hr />
      <h3>Access Token</h3>
      <div className="row">
        <div className="col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Enter access token..."
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
        </div>
      </div>
      <hr />
      <div className="row mt-5">
        <div className="col-md-12 d-flex justify-content-center my-3">
          <button className="button-89" onClick={handleSave}>
            Save & Proceed
          </button>
        </div>
      </div>
      <div className="copyRightClaims">
        <span>
          © FHStp (
          <a
            href="https://icmt.fhstp.ac.at/team/florian-grassinger"
            className="link-light"
            target="_blank"
          >
            me
          </a>
          )
        </span>
      </div>
    </div>
  );
};

export default DataInputScreen;
