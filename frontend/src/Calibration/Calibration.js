import React, { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AddGesture from './AddGesture';
import waiting from "../images/messages-typing.gif";

import "./Calibration.css";

function changeView(nextState, curState, setState) {
  //var prevState = curState;
  //prevState["view"] = nextState;
  //console.log("prevState: ", prevState);
  //setState({prevState});

  setState({
    view: nextState,
    gestures: curState.gestures
  });
}

const Calibration = (props) => {
    const history = useHistory();
    const [state, setState] = useState({
      view: "waiting",
      gestures: []
    });

    return (
      <div>
        { state.view == "waiting" ?
          <div className="waiting">
            <button className="goBackButton" onClick={() => history.push("/")}>← Go back</button>
            <h1>Calibration</h1>
            <div className="container">
              <img src={waiting} alt="Logo"/>
              <h1 className="smallHead"> Waiting for a response . . . </h1>
            </div>
            <button type="button" className="temp" onClick={() => changeView("calibrate", state, setState)}> Make a gesture </button>
          </div>

        : state.view === "calibrate"  ?
          <div>
            <button className="goBackButton" onClick={() => history.push("/")}>← Go back</button>
            <h1>Calibration</h1>
            <h2>Select an existing gesture or add a new gesture:</h2>
            <br />
            <button className="add" onClick={() => {changeView("add", state, setState)}}>Add Gesture +</button>
            <br />

            <div className="gestures">
              {(state.gestures).map( (gesture) =>
                <button type="button">{gesture}</button>
              )}
            </div>
          </div> 
        : 
          <AddGesture setter={setState} parentState={state} />
        }
    </div>
    );
  };

export default Calibration;
