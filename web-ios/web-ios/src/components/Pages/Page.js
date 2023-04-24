import React from 'react';
import '../../App.css';
import MasterIndexPage from '../Pages/MasterIndex/MasterIndexPage'
import MalfunctionsPage from '../Pages/Malfunctions/MalfunctionsPage'
import MapPage from '../Pages/Map/MapPage'
import FuelPage from '../Pages/Fuel/FuelPage'

const ArrayOfTabs = [
  'Master Index',
  'Fuel Page',
  'Map',
  'Malfunctions'
];

const allPages = {
  0: <MasterIndexPage />,
  1: <FuelPage />,
  2: <MapPage />,
  3: <MalfunctionsPage />,
}

export default function Page(props) {
  let i;
  for (i = 0; i < 4; i++) {
    if (ArrayOfTabs[i] === props.currentPage) {
      break;
    }
  }
  
  return (
    <div className='Page'>
      {allPages[i]}
    </div>
  );
}

Page.propTypes = {
};

Page.defaultProps = {
};
