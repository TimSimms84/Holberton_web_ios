import React from "react";
import { MalfArray } from '../Malfunctions/Malfunctions';

function MalfList(props) {
  const malfunctions = props.malfunctions;
  let allMalfunctions = [];
  malfunctions.map((malf, index) => {
    if (malf == 1) {
      allMalfunctions.push(
        <li key={index} >{MalfArray[index]}</li>
      );
    }
  })
  return (
    <div className="MalfList">
      <div className="outerMalfList">
        <div>
          <h3>Current Malfunctions:</h3>
        </div>
        <div>
          {allMalfunctions}
        </div>
      </div>
    </div>
  );
}

export default MalfList;
