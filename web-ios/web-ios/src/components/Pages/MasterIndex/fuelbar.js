import React, { Component } from 'react';
import propTypes from 'prop-types';
import '../../../App.css';

class FuelProgress extends Component {
  render() {
    const { FuelTotalTank, fuelLevel } = this.props;
    const progress = (fuelLevel / FuelTotalTank) * 100;
    return (
      <div className='fuel-progress'>
        <div className='fuel-header'>
          <h3>Total Fuel </h3>
        </div>
        <div className='fuel-bar'>
          <div className='fuel-bar-fill' style={{ width: `${progress}%` }} />
        <div className='fuel-info'>
          <p>Fuel Level: {fuelLevel} LBS</p>
          {/* Insert Fuel Progress bar here */}
        </div>
      </div>
      </div>
    );
  }
}

FuelProgress.propTypes = {
  FuelTotalTank: propTypes.number.isRequired,
  fuelLevel: propTypes.number.isRequired
};

export default FuelProgress;
