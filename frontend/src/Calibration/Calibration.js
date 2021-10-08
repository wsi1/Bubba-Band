import React, { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AddGesture from './AddGesture';

import "./Calibration.css";

function handleClick(state, setState) {
  setState({
    view: "add",
    gestures: state.gestures
  });
}

const Calibration = (props) => {
    const history = useHistory();
    const [state, setState] = useState({
      view: "calibrate",
      gestures: []
    });

    console.log("Calibration's state: ", state);
    return (
      <div>
        {state.view ==="calibrate"  ?
          <div>
            <button class="goBackButton" onClick={() => history.push("/")}>← Go back</button>
            <h1>Calibration</h1>
            <h2>Select an existing gesture or add a new gesture:</h2>
            <br />
            <button className="add" onClick={() => {handleClick(state, setState)}}>Add Gesture +</button>
            <br />

            {(state.gestures).map( (gesture) =>
              <button type="button">{gesture}</button>
            )}

          </div> 
        :
          <AddGesture setter={setState} parentState={state} />
        }
    </div>
    );
  };

export default Calibration;
