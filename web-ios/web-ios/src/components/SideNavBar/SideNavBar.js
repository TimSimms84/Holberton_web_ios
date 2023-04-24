import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../App.css';
import './SideNavBar.css'
import NavTab from './NavTab';

const ArrayOfTabs = [
  'Master Index',
  'Fuel Page',
  'Map',
  'Malfunctions'
];

export default function SideNavBar(props) {
  function selector(e) {
    setState({ activeTab: e.currentTarget.innerText });
    props.setCurrentPage(e.currentTarget.innerText);
  }
  const [state, setState] = useState({ activeTab: "Master Index" });
  const mapArray = ArrayOfTabs.map(tab => {
    let isActive;
    state.activeTab === tab ? isActive = true : isActive = false
    return (
        <NavTab
          key={tab}
          selector={selector}
          title={tab}
          page={tab}
          isActive={isActive} />
    )
  });
  return (
    <div className={'NavTab'}>
      {mapArray}
    </div>
  );
}

SideNavBar.propTypes = {
  setCurrentPage: PropTypes.func
};

SideNavBar.defaultProps = {
  setCurrentPage: () => {}
};
