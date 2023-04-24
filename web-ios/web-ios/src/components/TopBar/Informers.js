import React, { useState, useEffect } from 'react';
import Informer from './Informer';
import './topbar.css';
import { useUpdateValueWebSocket } from '../../WebSocket';

const informers = {
    'TAS' : {'kts' : 300},
    'Heading' : {'deg' : 270},
    'Altitude' : {'ft' : 30000},
}

export let coordinatePath = [];

const Informers = () => {
  let value;
  const [state, setState] = useState({TAS: 0, Heading: 0, Altitude: 0});
  const wsData = useUpdateValueWebSocket();
  useEffect(() => {
    if (wsData) {
      setState({Heading: wsData.BASIC_HEADING, TAS: wsData.BASIC_SPEED, Altitude: wsData.BASIC_Z});
      coordinatePath.push({ x: wsData.BASIC_X, y: wsData.BASIC_Y });
    }
  }, [wsData]);
  return (
    <div className="Informers">
      {Object.keys(informers).map((key) => {
        if (key === "TAS") {
          value = state.TAS;
        } if (key === "Heading") {
          value = state.Heading;
        } if (key === "Altitude") {
          value = state.Altitude;
        }
        return (
          <Informer
            key={key}
            value={value}
            title={key}
            datatype={Object.keys(informers[key])[0]} />
        )
      })}
    </div>
  )
}

export default Informers;
