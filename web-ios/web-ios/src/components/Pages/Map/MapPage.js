import React, {useState, useEffect} from 'react';
import Coordinates from './Coordinates';
import { useUpdateValueWebSocket } from '../../../WebSocket';
import Graph from './Graph';


export default function MapPage() {
  const [state, setState] = useState({
    x: 0,
    y: 0
  });
  const wsData = useUpdateValueWebSocket();
  useEffect(() => {
    if (wsData) {
      setState({ 
        x: wsData.BASIC_X,
        y: wsData.BASIC_Y,
       });
    }
  }, [wsData]);
    return (
      <div className='MapPage'>
        <Coordinates x={Math.round(10000*state.x)/10000} y={Math.round(10000*state.y)/10000} />
        <Graph x={state.x} y={state.y} />
      </div>
    );
};
