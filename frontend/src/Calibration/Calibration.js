import React, { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AddGesture from './AddGesture';

import "./Calibration.css";

function handleClick(history, state) {
  history.push('/addGesture');
  state = "add";
}

const Calibration = (props) => {
    const history = useHistory();
    const [state, setState] = useState("calibrate");

    return (
      <div>
        {state ==="calibrate"  ?
        <div>
          <button onClick={() => history.push("/")}>← Go Back</button>
          <h1>Calibration</h1>
          <h2>Select an existing gesture or add a new gesture:</h2>
          <br />
          <button className="add" onClick={() => {handleClick(history, state)}}>Add Gesture +</button>
          <br />
        </div> :

        <AddGesture />
        }
    </div>
    );
  };

export default Calibration;
