import React from 'react';
import propTypes from 'prop-types';
import './Map.css';

function Coordinates(props) {
    const { x, y } = props;
    return (
      <div className='Coordinates'>
        <div className=''>
          <h3>Current Coordinates: X: {x} Y: {y}</h3>
        </div>
      </div>
    );
  }

Coordinates.propTypes = {
  x: propTypes.number,
  y: propTypes.number,
};

export default Coordinates;
