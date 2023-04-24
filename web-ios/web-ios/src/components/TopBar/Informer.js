import React from 'react';
import propTypes from 'prop-types';
import './topbar.css';


const Informer = ({ title, value, datatype }) => {
  return (
    <div className={'informer ' + title}>
      <h3>{title}</h3>
      <p>{value} {datatype}</p>
    </div>
  );
};

Informer.propTypes = {
  datatype: propTypes.string.isRequired,
  title: propTypes.string.isRequired,
  value: propTypes.number.isRequired,
};

Informer.defaultProps = {
  title: '',
  value: 0,
};

export default Informer;
