import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { formatTimestamp, renderAdditionalInfo } from '../utils';
import Swal from 'sweetalert2';

import './SensorCard.css';

const SensorCard = ({
  sensorName,
  apiPath,
  accessToken,
  refreshKey,
  boxColor,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attemptMade, setAttemptMade] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(apiPath, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response.data);
      setLoading(false);
      console.log(response.data)
    } catch (error) {
      setLoading(false);
      setAttemptMade(true);

      if (error.response && error.response.status === 401) {
        setError('Unauthorized access. Please check your access token.');
      } else {
        setError('Failed to fetch data. Please try again later.');
      }
    }
  }, [apiPath, accessToken]);

  useEffect(() => {
    if (attemptMade) return;
    fetchData();
  }, [fetchData, refreshKey]);

  if (loading) {
    return <div className="text-center my-3 text-light">Loading...</div>;
  }

  if (error) {
    return (
      <div className="col-md-6 mb-4">
        <div className="sensor-card card bg-dark text-white h-100">
          <div className="card-body">
            <p className="text-danger">{error}</p>
            <p className="text-light">
              <strong>Path:</strong> {apiPath}
            </p>
            <p className="text-light">
              <strong>Access Token:</strong> {accessToken.substring(0, 10)}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-6 mb-4">
      <div className="sensor-card card bg-dark text-white h-100">
        <div className="card-body">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2 className="card-title h5">{sensorName}</h2>
            {boxColor && (
              <div
                style={{
                  backgroundColor: boxColor,
                  width: '30px',
                  height: '30px',
                  borderRadius: '5px',
                  boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)',
                  alignSelf: 'center',
                }}
              />
            )}
          </div>
          <h3 className="small text-white">
            API Path: <span style={{ fontSize: '0.7em' }}>{apiPath}</span>
          </h3>
          <div className="sensor-data table-responsive">
            <table className="table table-dark table-bordered table-striped">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Value</th>
                  <th>Additional Info</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.measurementResults &&
                  data.measurementResults.map((item, index) => (
                    <tr key={index}>
                      <td>{formatTimestamp(item.timeStamp)}</td>
                      <td>{item.value}</td>
                      <td>
                        {item.additionalProperties &&
                          renderAdditionalInfo(item.additionalProperties)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;
