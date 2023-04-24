import React, {useState, useEffect} from 'react';
import FuelProgress from './fuelbar';
import Radio from './Radio';
import './MasterIndex.css'
import IOSstatus from './IOSstatus';
import { useUpdateValueWebSocket } from '../../../WebSocket';
import { currentMalfunctions } from '../Malfunctions/Malfunctions';
import MalfList from './MalfList';

export default function MasterIndexPage() { 
  const [state, setState] = useState({
    connected: "Not Connected",
    totalFuel: 0,
    malfunctions: [0, 0, 0]
  });
  const wsData = useUpdateValueWebSocket();
  useEffect(() => {
    if (wsData) {
      setState({
        connected: "Connected",
        totalFuel: wsData.BASIC_FUEL_R + wsData.BASIC_FUEL_L + wsData.BASIC_FUEL_F,
        tuning: wsData.BASIC_RADIO,
        malfunctions: [
          wsData.BASIC_MALF_ENGINE_FLAMEOUT,
          wsData.BASIC_MALF_RADIO,
          wsData.BASIC_MALF_FUEL_FLOW
        ]
      });
    }
  }, [wsData]);
    return (
      <div className='MasterIndex'>
        <div className='IOS'>
          <IOSstatus connected={state.connected} />
        </div>
        <div className='fuel'>
          <FuelProgress
            FuelTotalTank={12000}
            fuelLevel={state.totalFuel} />
        </div>
        <div className='radio' style={state.malfunctions[1] ? {border: 'solid rgba(255, 0, 0, 0.658)'} : {}} >
          <Radio tuning={Math.round(10*state.tuning)/10} R={0} T={0} />
        </div>
        <div className='malfunctionList'>
          { state.malfunctions.reduce((pSum, a) => pSum + a, 0) > 0 &&
          <MalfList malfunctions={state.malfunctions} /> }
        </div>
      </div>
    );
};
