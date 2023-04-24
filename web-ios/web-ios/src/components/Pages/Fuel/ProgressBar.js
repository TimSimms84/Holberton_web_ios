import React from "react";
import PropTypes from 'prop-types';
import './Fuel.css';

export default function ProgressBar({ width, height, total_fuel, current_fuel, className }) {
  let color = "green";
  if (current_fuel / total_fuel <= .20) {
    color = "red";
  }
  const barStyle = {
    height: `${height}px`,
    width: `${width}px`,
    border: "1px solid black",
    position: "relative",
    backgroundColor: "rgb(87, 87, 87)",
    
  };
  const fillStyle = {
    height: `${(current_fuel * height) / total_fuel}px`,
    backgroundColor: color,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  };
  
  return (
    <div className={"ProgressBar " + className}>
      <div style={barStyle} className={"TotalBar"}>
        <div style={fillStyle} className="CurrentBar"></div>
      </div>
    </div>
  )
}

ProgressBar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  total_fuel: PropTypes.number,
  current_fuel: PropTypes.number
}

ProgressBar.defaultProps = {
  total_fuel: 3000,
  current_fuel: 3000
}
