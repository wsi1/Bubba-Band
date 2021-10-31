import React, { Component, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AddGesture from './AddGesture';
import waiting from "../images/messages-typing.gif";
import useSound from "use-sound";
import back from "../audios/go_back.mp3";
import addGesture from "../audios/add_gesture.mp3";

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
function handleBackPress(setState) {
    if (window.confirm("You are about to forget the gesture just made, are you sure?")) {
        setState({
            view: "waiting"
        })
    }
}

const Calibration = (props) => {
    const history = useHistory();
    const [state, setState] = useState({
        view: "waiting"
    });
    const [playBack] = useSound(back);
    const [playAdd] = useSound(addGesture);

    return (
    <div>
        { state.view == "waiting" ?
        <div className="waiting">
            <button 
            className="goBackButton" 
            onMouseEnter={() => playBack()}
            onClick={() => history.push("/")}>
            ← Go back
            </button>

            <h1>Calibration</h1>
            <div className="calibrationContainer">
                <img src={waiting} alt="Logo"/>
                <h1 className="smallHead"> Waiting for a response . . . </h1>
            </div>
            <button type="button" className="temp" onClick={() => changeView("calibrate", state, setState)}> Make a gesture </button>
        </div>

        : state.view === "calibrate"  ?
        <div>
            <button
            className="goBackButton" id="skip"
            onMouseEnter={() => playBack()}
            onClick={() => handleBackPress(setState)}>
                ← Skip gesture label
            </button>

            <h1>Gesture needs a label!</h1>
            <p id="instructions">To label the gesture, click "Add Gesture" to make a new gesture label or select an existing gesture below.</p>
            <div class="buttons"> 
              <button 
              className="add" 
              onMouseEnter={() => playAdd()}
              onClick={() => {changeView("add", state, setState)}}>
                  Add Gesture
              </button>
              <br />
              <hr className="divide"/>
              <br />
              <div className="gestures">
                  {props.existingGestures.length == 0 ? 
                  <div> 
                      <p id="noExisting">No gestures have been created yet.</p>
                  </div>
                  :
                  <div> 
                      {(props.existingGestures).map((gesture) =>
                          <button type="button">{gesture}</button>
                      )}
                  </div>
                  }
              </div>
            </div> 
            <br />
        </div> 
        : 
            <AddGesture setter={setState} parentState={state} existingGestures={props.existingGestures} /> 
        }
    </div>
    );
};

export default Calibration;
