import React, { Component, useState} from 'react';
import { useHistory } from 'react-router-dom';
import waiting from '../images/messages-typing.gif'; // Tell webpack this JS file uses this image

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

function changeDisplay(state, setState, isOn) {
  setState({
    view: "settings",
    isDisplayOn: isOn,
    isAudioOn: state.isAudioOn
  })
}

function changeAudio(state, setState, isOn) {
  setState({
    view: "settings",
    isDisplayOn: state.isDisplayOn,
    isAudioOn: isOn
  })
}

const Settings = (props) => {
  const history = useHistory();
  const [state, setState] = useState(props.parentState.state);

  console.log(state);

  return (
    <div>
      <button class="goBackButton" onClick={() => goBack(state, props.setter)}>← Go back</button>
      <div class="content">
        <div class="settings">
          <p class="title">Display response</p>
          <p class="descr">Display animations on screen</p>
          <div class="buttonContainer">
            <button class="settingsButton" id={state.isDisplayOn ? "on" : ""} onClick={() => changeDisplay(state, setState, true)}>ON</button>
            <button class="settingsButton" id={!state.isDisplayOn ? "on" : ""} onClick={() => changeDisplay(state, setState, false)}>OFF</button>
          </div>
        </div>
        <div class="settings">
          <p class="title">Auditory response</p>
          <p class="descr">Output response through speaker</p>
          <div class="buttonContainer">
            <button class="settingsButton" id={state.isAudioOn ? "on" : ""} onClick={() => changeAudio(state, setState, true)}>ON</button>
            <button class="settingsButton" id={!state.isAudioOn ? "on" : ""} onClick={() => changeAudio(state, setState, false)}>OFF</button>
          </div>
        </div>
      </div>

      <h1>Settings</h1>
    </div>
  );
};

export default Settings;
