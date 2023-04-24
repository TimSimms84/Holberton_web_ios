import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import './topbar.css';
import { useUpdateValueWebSocket } from '../../WebSocket';

function Toggle(props) {
  let disabled = false;
  let underLineText;
  const [state, setState] = useState({
    isActive: props.isActive || false,
    idx: 0,
    malfEngineFlameOut: 0
  });

  function handleClick() {
    props.handleChange(!state.isActive);
  }
  const wsData = useUpdateValueWebSocket();
  useEffect(() => {
    let active;
    let idx;
    if (title === 'Engine') {
      idx = wsData.BASIC_ENGINE;
    } else {
      idx = wsData.EXEC_SIM_STATE - 1;
    }
    active = idx === 1 ? true : false;
    if (wsData) {
      setState({idx: idx, isActive: active, malfEngineFlameOut: wsData.BASIC_MALF_ENGINE_FLAMEOUT });
    }
  }, [wsData]);

  const { isActive } = state;
  const { title, button, buttonState} = props;
  underLineText = <h2>{title}: {buttonState[state.idx]}</h2>;
  if (state.malfEngineFlameOut === 1 && title === "Engine") {
    disabled = true;
    underLineText = <u><h2>{title}: {buttonState[state.idx]}</h2></u>;
  }
  return (
    <div disabled className={`toggle ${isActive ? 'tactive' : ''}`} >
      {underLineText}
      <button  onClick={handleClick} className='button' disabled={disabled} >{button[state.idx]}</button>
    </div>
  );
}

Toggle.propTypes = {
  title: propTypes.string.isRequired,
  button: propTypes.array.isRequired,
  buttonState: propTypes.array.isRequired,
  isActive: propTypes.bool,
  handleChange: propTypes.func,
};

Toggle.defaultProps = {
  isActive: false,
  handleChange: () => {},
};

export default Toggle;
