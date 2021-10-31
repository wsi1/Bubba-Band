import React, { Component, useState, useEffect, useContext } from 'react';
import { socket, SocketContext } from '../context/socket';
import { useHistory } from 'react-router-dom';
import useSound from "use-sound";
import back from "../audios/go_back.mp3";
import addGesture from "../audios/add_gesture.mp3";

import "./AddGesture.css";

//If it returns true, then the form is submitted. If false, then the form isn't submitted.
function handleSubmit(event, val, setState, gestures, uuid) {
  //Prevents it automically submitting even if this function returns false
  event.preventDefault();

  //If the user didn't enter anything for the label
  if (val === "") {
    window.alert("Label can't be empty");
    return false;
  }
  else {
    // To confirm that the value entered was the right one. 
    if (!window.confirm("Gesture will be classfied as '" + val + "'. Click OK to confirm.")) {
      return false;
    }

    var newState = gestures;
    if (typeof newState === "undefined") {
      newState = [val];
    }
    else {
      newState.push(val);
    }

    socket.emit("frontend", {
      uuid: uuid,
      label: val,
    });
    console.log("emitting UUID:", uuid);
    console.log("emitting label:", val);

    setState({
      view: "waiting",
    });

    return true;
  }
}

function handleChange(e, setState, uuid) {
  setState({
    uuid: uuid,
    value: e.target.value
  });
}

function handleBackPress(setState) {
  setState({
    view: "calibrate",
  })
}

const AddGesture = (props) => {
  const [state, setState] = useState({
    uuid: props.parentState.uuid,
    value: "",
  });
  const [playBack] = useSound(back);
  const [playAdd] = useSound(addGesture);

  console.log("AddGesture state: ", state);

  const socket = useContext(SocketContext);

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
        <form onSubmit={(e) => {
          handleSubmit(e, state.value, props.setter, props.existingGestures, state.uuid)
        }}>
          <input type="text" autoFocus value={state.value} onChange={(e) => { handleChange(e, setState, state.uuid) }} />
          <input type="submit" onMouseEnter={() => playAdd()} value="Add Gesture" />
        </form>
      </div>
    </div>
  );
};

export default AddGesture;
