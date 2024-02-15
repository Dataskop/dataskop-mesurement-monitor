import React from 'react';

const SensorForm = ({ sensor, onSensorChange, onRemove, index }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSensorChange({ ...sensor, [name]: value });
  };

  return (
    <div className="sensor-form d-flex align-items-center mb-3">
      <input
        type="text"
        name="url"
        placeholder="Enter the path here..."
        value={sensor.url || ''}
        onChange={handleChange}
        className="form-control me-2"
      />
      <input
        type="text"
        name="sensorName"
        placeholder="Enter the sensor name"
        value={sensor.sensorName || ''}
        onChange={handleChange}
        className="form-control me-2"
      />
      <input
        type="color"
        name="boxColor"
        value={sensor.boxColor || '#ffffff'}
        onChange={handleChange}
        className="form-control form-control-color me-2"
        style={{ width: '75px' }}
      />
      <button 
        onDoubleClick={onRemove} 
        className="btn btn-danger"
        id={`remove-sensor-${index}`}
        data-bs-toggle="tooltip" 
        data-bs-placement="top" 
        title="Double click to remove current path"
      >
        -
      </button>
    </div>
  );
};

export default SensorForm;
