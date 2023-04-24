import React from 'react';
import PropTypes from 'prop-types';

const IOSstatus = ({  }) => {
  let connected = "Connected";
  return (
    <div className='IOSstatus'>
      <h3>IOS Status: {connected}</h3>
    </div>
  );
};

IOSstatus.propTypes = {
  connected: PropTypes.string
};

IOSstatus.defaultProps = {
};

export default IOSstatus;
