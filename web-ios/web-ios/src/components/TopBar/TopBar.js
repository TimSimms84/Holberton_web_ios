import React from 'react';
import propTypes from 'prop-types';
import Informers from './Informers';
import Toggle from './toggle';
import './topbar.css';
import { ws } from '../../WebSocket';

export default function TopBar({ title, value, datatype }) {
  function turnEngineOnOrOff(isActive) {
    if (isActive) {
      ws.send("BASIC_ENGINE 1");
    } else {
      ws.send("BASIC_ENGINE 0");
    }
  }
  function freezeOrUnfreezeSim(isActive) {
    if (isActive) {
      ws.send(`EXEC_SIM_STATE 2`);
    } else {
      ws.send("EXEC_SIM_STATE 1");
    }
  }
  return (
    <div className='top-bar'>
      <Informers />
      <div className='Toggle'>
        <Toggle
          title={'Engine'}
          buttonState={['Off', 'On']}
          button={['Start', 'Stop']}
          handleChange={turnEngineOnOrOff} />
        <Toggle
          title={'Simulation State'}
          buttonState={['Running', 'Frozen']}
          button={['Freeze', 'Unfreeze']}
          handleChange={freezeOrUnfreezeSim} />
      </div>
    </div>
  );
};
