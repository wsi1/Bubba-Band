import React, { Component, useState} from 'react';
import { useHistory } from 'react-router-dom';
import waiting from '../images/messages-typing.gif'; // Tell webpack this JS file uses this image
import useSound from "use-sound";
import back_audio from "../audios/go_back.mp3";
import displayImage from "../images/display.png"
import volumeImage from "../images/volume.png"

import "./Settings.css";

let goBackAudio = new Audio(back_audio);

let allAudios = [goBackAudio];

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

function playAudio(audio) {
  // if the mouse moves to another element before the previous sound finishes,
  // stop the previous sound before playing the new sound
  // this is to prevent sounds from overlapping one another with quick mouse movement
  allAudios.forEach(function(a) {
    a.pause();
    a.currentTime = 0;
  })

  audio.play();
}


const Settings = (props) => {
  const history = useHistory();
  const [state, setState] = useState(props.parentState.state);

  console.log("Settings State: ", state);

  return (
    <div>
      <button 
      class="goBackButton" 
      onMouseEnter={() => playAudio(goBackAudio)}
      onClick={() => goBack(state, props.setter)}>
      ← Go back
      </button>
      <div id="all">
          <h1>Settings</h1>      
          </div>
          <div class="content">
            <div class="settings">
              <p class="title">Animations</p>
              <p class="caption">When turned on, an animation will appear each time a gesture is made.</p>
              <img src={displayImage} class="settingsImage" alt="TV screen"/>
              <p class="descr">{state.isDisplayOn ? "Animations for gestures are ON" : "Animations for gestures are OFF"}</p>
              <div class="buttonContainer">
                  <label class="switch">
                    <input type="checkbox" id="displayToggle" checked={state.isDisplayOn} onChange={() => updateDisplayToggle(state, setState)}/>
                    <span class="slider round"></span>
                  </label>
                </div>
            </div>
            <div class="settings">
              <p class="title">Audio Output</p>
              <p class="caption">When turned on, audio of the interpreted response will play each time a gesture is made.</p>
              <img src={volumeImage} class="settingsImage" alt="TV screen"/>
              <p class="descr">{state.isAudioOn ? "Audio output for gestures is ON" : "Audio output for gestures is OFF"}</p>
              <div class="buttonContainer">
                <label class="switch">
                  <input type="checkbox" id="audioToggle" checked={state.isAudioOn} onChange={() => updateAudioToggle(state, setState)}/>
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
        </div>
      </div>
  );
};

export default Settings;
