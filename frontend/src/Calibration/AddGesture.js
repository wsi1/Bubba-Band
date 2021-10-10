import React, { Component, useState} from 'react';
import { useHistory } from 'react-router-dom';

import "./AddGesture.css";

function handleSubmit(event, val, setState, state) {
  event.preventDefault();
  if (val === "") {
    window.alert("Label can't be empty");
    return false;
  }
  else {
    var newState = state.gestures;
    if (typeof newState === "undefined") {
      newState = [val];
    }
    else {
      newState.push(val);
    }
    
    setState({
      view: "calibrate",
      gestures: newState,
    });

    return true;
  }
  
}

function goBack(state, setState) {
  setState( {
    view: "calibrate",
    gestures: state.gestures,
  })
}

function handleChange(e, setState) {
  setState({value: e.target.value});
}

const AddGesture = (props) => {
    const history = useHistory();
    const [state, setState] = useState({
      value: "",
    });

    return (
      <div className="addGesture">
        <button className="goBackButton" onClick={() => goBack(props.parentState, props.setter)}>← Go back</button>
        <h1> Create a new gesture </h1>
        <h2>Type in gesture name: </h2>
        <div className="form-center">
          <form onSubmit={(e, ) => {
              handleSubmit(e, state.value, props.setter, props.parentState)
            }}>
            <input type="text" autoFocus value={state.value} onChange={ (e) => {handleChange(e, setState)}} />
            <input type="submit" value="Add Gesture" />
          </form>
        </div>
      </div>
    );
  };



export default AddGesture;
