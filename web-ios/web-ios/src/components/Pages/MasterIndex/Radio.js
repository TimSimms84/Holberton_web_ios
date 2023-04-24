import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUpdateValueWebSocket } from '../../../WebSocket';


const Radio = ({ tuning, receive, transmit }) => {
  const [ state, setState ] = useState({
    T: 0,
    R: 0
  });
  const wsData = useUpdateValueWebSocket();
  useEffect(() => {
    if (wsData) {
      setState({ 
        T: wsData.BASIC_RADIO_TX,
        R: wsData.BASIC_RADIO_RX
      })
    }
  }, [wsData]);
  return (
    <div className='radio-tuning'>
      <div className='radio-tuning-container'>
        <h2>Tuning: {tuning} hz </h2>
      </div>
      <div className='radio-indicators'>
        <div className='T-R'>
          <h3 className='recieve'>Receive: {receive}</h3>
          <h3 className='transmit'>Transmit: {transmit}</h3>
        </div>
        <div className='T-R-dots'>
          <span className={state.T ? "dot": "dot dActive"}></span>
          <span className={state.R ? "dot": "dot dActive"}></span>
        </div>
      </div>
    </div>
  );
};

Radio.propTypes = {
  tuning: PropTypes.number.isRequired,
  receive: PropTypes.bool,
  transmit: PropTypes.bool,
};

Radio.defaultProps = {
  tuning: '',
  receive: false,
  transmit: false,
};

export default Radio;
