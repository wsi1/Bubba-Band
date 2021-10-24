import React, { Component, useState} from 'react';
import { useHistory } from 'react-router-dom';
import waiting from '../images/messages-typing.gif'; // Tell webpack this JS file uses this image
import useSound from "use-sound";
import back_audio from "../audios/go_back.mp3";

import "./Settings.css";

function goBack(state, setState) {
  setState({
    backgroundColor: '#1c1c1c',
    displayWaiting: true,
    displayYes: false,
    displayNo: false,
    displayHi: false,
    isDisplayOn: state.isDisplayOn,
    isAudioOn: state.isAudioOn,
    image: waiting,
    text: 'Waiting for a response...'
  });
}

function updateDisplayToggle(state, setState) {
  var checkBox = document.getElementById("displayToggle");
  console.log(checkBox.checked);
  setState({
    view: "settings",
    isDisplayOn: checkBox.checked,
    isAudioOn: state.isAudioOn
  })
}

function updateAudioToggle(state, setState) {
  var checkBox = document.getElementById("audioToggle");
  console.log(checkBox.checked);
  setState({
    view: "settings",
    isDisplayOn: state.isDisplayOn,
    isAudioOn: checkBox.checked
  })
}


const Settings = (props) => {
  const history = useHistory();
  const [state, setState] = useState(props.parentState.state);

  console.log("Settings State: ", state);

  const [playBack] = useSound(back_audio);
  return (
    <div>
      <button 
      class="goBackButton" 
      onMouseEnter={() => playBack()}
      onClick={() => goBack(state, props.setter)}>
      ← Go back
      </button>
      
      <div class="content">
        <div class="settings">
          <p class="title">Display response</p>
          <p class="descr">Display animations on screen</p>
          <div class="buttonContainer">
              <label class="switch">
                <input type="checkbox" id="displayToggle" checked={state.isDisplayOn} onChange={() => updateDisplayToggle(state, setState)}/>
                <span class="slider round"></span>
              </label>
            </div>
        </div>
        <div class="settings">
          <p class="title">Auditory response</p>
          <p class="descr">Output response through speaker</p>
          <div class="buttonContainer">
            <label class="switch">
              <input type="checkbox" id="audioToggle" checked={state.isAudioOn} onChange={() => updateAudioToggle(state, setState)}/>
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      <h1>Settings</h1>
    </div>
  );
};

export default Settings;
