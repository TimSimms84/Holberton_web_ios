import React, {useState, useEffect} from 'react';
import ProgressBar from './ProgressBar';
import { useUpdateValueWebSocket } from '../../../WebSocket';

export default function FuelPage() {
  let warning = '';
  const [state, setState] = useState({
    current_left: 0,
    current_fuselage: 0,
    current_right: 0,
    current_total: 0,
  });
  const wsData = useUpdateValueWebSocket();
  useEffect(() => {
    if (wsData.BASIC_FUEL_F && wsData.BASIC_FUEL_L && wsData.BASIC_FUEL_R) {
      setState({
        current_left: wsData.BASIC_FUEL_L,
        current_fuselage: wsData.BASIC_FUEL_F,
        current_right: wsData.BASIC_FUEL_R,
        current_total: wsData.BASIC_FUEL_L + wsData.BASIC_FUEL_F + wsData.BASIC_FUEL_R,
        fuelFlowMalfunction: wsData.BASIC_MALF_FUEL_FLOW
      });
    }
  }, [wsData]);
  if (state.fuelFlowMalfunction) {
    warning = <div 
    className='fuelFlowWarning'
    style={{ color: 'red' }}>Warning! Fuel Flow Failure</div>; 
  }
  return (
    <div className='FuelPage'>
      {warning}
      <div className='individualTanks'>
        <div className='leftTank'>
          <div className='ITlabel'>
            <h4>Left Wing Tank</h4>
            <p>{state.current_left} LBs</p>
          </div>
          <ProgressBar width={30} height={300} total_fuel={4000} current_fuel={state.current_left}/>
        </div>
        <div className='fTank'>
          <div className='ITlabel'>
            <h4>Main Fuselage Tank</h4>
            <p>{state.current_fuselage} LBs</p>
          </div>
          <ProgressBar width={30} height={300} total_fuel={4000} current_fuel={state.current_fuselage}/>
        </div>
        <div className='rightTank'>
          <div className='ITlabel'>
            <h4>Right Wing Tank</h4>
            <p>{state.current_right} LBs</p>
          </div>
          <ProgressBar width={30} height={300} total_fuel={4000} current_fuel={state.current_right}/>
        </div>
      </div>
      <div className='totalTank'>
        <ProgressBar
        width={70}
        height={500}
        total_fuel={12000}
        current_fuel={state.current_total} />
        <div className='TotalTankLabel'>
          <h3>Fuel Totalizer:</h3>
          <p>{state.current_total} LBs</p>
        </div>
      </div>
    </div>
  );
};
