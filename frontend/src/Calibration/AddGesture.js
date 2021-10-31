import React, { Component, useState} from 'react';
import { useHistory } from 'react-router-dom';
import useSound from "use-sound";
import back from "../audios/go_back.mp3";
import addGesture from "../audios/add_gesture.mp3";

import "./AddGesture.css";

//If it returns true, then the form is submitted. If false, then the form isn't submitted.
function handleSubmit(event, val, setState, gestures) {
    //Prevents it automically submitting even if this function returns false
    event.preventDefault();
    //If the user didn't enter anything for the label
    if (val === "") {
        window.alert("Label can't be empty");
        return false;
    }
    else {
        //To confirm that the value entered was the right one. 
    
        if (!window.confirm("Gesture just classfied as '" + val + "'. Click OK to confirm.")) {
            return false;
        }

        var newState = gestures;
        if (typeof newState === "undefined") {
        newState = [val];
        }
        else {
        newState.push(val);
        }
        
        setState({
        view: "waiting",
        });

        return true;
    }
}

function handleChange(e, setState) {
  setState({value: e.target.value});
}

function handleBackPress(setState) {
    setState({
        view: "calibrate",
    })
}


const AddGesture = (props) => {
    const [state, setState] = useState({
      value: "",
    });
    const [playBack] = useSound(back);
    const [playAdd] = useSound(addGesture);

    return (
      <div className="addGesture">
        <button 
        className="goBackButton" 
        onMouseEnter={(() => playBack())}
        onClick={() => handleBackPress(props.setter)}>
        ← Go back
        </button>
          
        <h1> Create a new gesture </h1>
        <h2>Type in gesture name: </h2>
        <div className="form-center">
          <form onSubmit={(e, ) => {
              handleSubmit(e, state.value, props.setter, props.existingGestures)
            }}>
            <input type="text" autoFocus value={state.value} onChange={ (e) => {handleChange(e, setState)}} />
            <input type="submit" onMouseEnter={() => playAdd()} value="Add Gesture" />
          </form>
        </div>
      </div>
    );
  };



export default AddGesture;
