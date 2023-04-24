import React, { useState, useEffect } from "react";
import { useUpdateValueWebSocket, ws } from '../../../WebSocket';

export const MalfArray = [
  "Engine Flameout",
  "Radio Failure",
  "Fuel Flow Failure"
];

function Malfunctions(props) {
   const [ state, setState ] = useState({
    malfunctions: [0, 0, 0]
  });

  const wsData = useUpdateValueWebSocket();
  useEffect(() => {
    if (wsData) {
      setState({ 
        malfunctions: [
          wsData.BASIC_MALF_ENGINE_FLAMEOUT,
          wsData.BASIC_MALF_RADIO,
          wsData.BASIC_MALF_FUEL_FLOW,
        ]});
    }

  }, [wsData]);

  function handleClick(e, index) {
    const malf = e.currentTarget.innerHTML;
    let val;
    if(malf === "Engine Flameout") {
      state.malfunctions[0] ? val = 0 : val = 1;
      ws.send(`BASIC_MALF_ENGINE_FLAMEOUT ${val}`);
    }
    if(malf === "Radio Failure") {
      state.malfunctions[1] ? val = 0 : val = 1;
      ws.send(`BASIC_MALF_RADIO ${val}`);
    }
    if(malf === `Fuel Flow Failure`) {
      state.malfunctions[2] ? val = 0 : val = 1;
      ws.send(`BASIC_MALF_FUEL_FLOW ${val}`);
    }
  }
    return (
      <div className="Malfunctions">
        {state.malfunctions.map((malfStatus, index) => (
          <div
            className="MalfItem"
            key={index}
            onClick={(e) => handleClick(e, index)}
            style={{ backgroundColor: malfStatus ? "red" : "grey" }} >
            {MalfArray[index]}
          </div>
        ))}
      </div>
    );
}

export default Malfunctions;
